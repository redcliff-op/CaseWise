import { create } from "zustand";
import {
  GoogleSignin,
  isSuccessResponse,
  User,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { Content, GoogleGenerativeAI } from "@google/generative-ai";
import RNFS from "react-native-fs";
import { documentPrompt, summaryPrompt } from "@/utils/constants/prompts";
import { GEMINI_API_KEY, WEB_CLIENT_ID } from "@/Keys";
import { Alert } from "react-native";
import { clearMarkdown } from "@/utils/utils";
import { DocumentAnalysis, UserData } from "@/global";
import firestore from "@react-native-firebase/firestore";
import { defaultUserData } from "@/utils/constants/defaultUserData";

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

type state = {
  user: User | null;
  userData: UserData;
  contextHistory: Content[];
  documentAnalysis: DocumentAnalysis | null;
  documentSummary: string | null;
  documentSummaryLines: string[] | null;
};

type actions = {
  signIn: () => Promise<void>;
  signInSilent: () => Promise<void>;
  signOut: () => Promise<void>;
  getDocumentAnalysis: (file: string) => Promise<void>;
  getDocumentSummary: (lang: string) => Promise<void>;
  syncUserData: () => Promise<void>;
};

type loaders = {
  signInSilentLoading: boolean;
  responseLoading: boolean;
};

const useStore = create<state & actions & loaders>((set, get) => ({
  user: null,
  userData: defaultUserData,
  contextHistory: [],
  documentAnalysis: null,
  documentSummary: null,
  documentSummaryLines: null,

  signInSilentLoading: false,
  responseLoading: false,

  signIn: async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        set({ user: response?.data });
        router.navigate(`/Home`);
        const userRef = firestore()
          .collection("Users")
          .doc(response.data.user.email.toString());
        const userSnapshot = await userRef.get();
        if (!userSnapshot.exists) {
          await userRef.set({
            preferences: {
              summaryLang: "English",
            },
          });
        } else {
          const userData = await userSnapshot.data();
          set({ userData: userData as UserData });
        }
      }
    } catch (error) {
      console.log(error);
    }
  },

  signInSilent: async () => {
    try {
      set({ signInSilentLoading: true });
      const response = await GoogleSignin.signInSilently();
      set({ signInSilentLoading: false });
      if (response.data) {
        set({ user: response.data });
        router.navigate(`/Home`);
        const userRef = firestore()
          .collection("Users")
          .doc(response.data.user.email.toString());
        const userSnapshot = await userRef.get();
        const userData = await userSnapshot.data();
        set({ userData: userData as UserData });
      }
    } catch (error) {
      console.log(error);
    }
  },

  signOut: async () => {
    try {
      await GoogleSignin.signOut();
      router.dismissAll();
      await new Promise((resolve) => setTimeout(resolve, 500));
      set({ user: null, userData: defaultUserData });
    } catch (error) {
      console.log(error);
    }
  },

  syncUserData: async () => {
    try {
      const userRef = firestore()
        .collection("Users")
        .doc(get().user?.user.email.toString());
      const userData = get().userData;
      await userRef.update({
        preferences: userData.preferences
      });
    } catch (error) {
      Alert.alert(
        "Unknown Firebase Error",
        "Could not update user preferences"
      );
    }
  },

  getDocumentAnalysis: async (file: string) => {
    try {
      set({ responseLoading: true });

      const history = get().contextHistory;
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const chat = model.startChat({
        history: history,
      });

      const pdfData = await RNFS.readFile(file, "base64");
      const pdf = {
        inlineData: {
          data: pdfData,
          mimeType: "application/pdf",
        },
      };

      const result = await chat.sendMessage([documentPrompt, pdf]);
      const response = result.response;
      const text = response.text();

      set({ documentAnalysis: JSON.parse(text) });
      set({ contextHistory: history });
    } catch (error) {
      Alert.alert("Error Getting Document Analysis", error?.toString());
    } finally {
      set({ responseLoading: false });
    }
  },

  getDocumentSummary: async (lang: string) => {
    try {
      set({ responseLoading: true });

      const history = get().contextHistory;
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "text/plain",
        },
      });

      const chat = model.startChat({
        history: history,
      });

      const result = await chat.sendMessage(summaryPrompt(lang));
      const response = result.response;
      const text = response.text();
      set({ documentSummary: text });
      set({ contextHistory: history });
      set({ documentSummaryLines: clearMarkdown(text).split("\n") });
    } catch (error) {
      Alert.alert("Error Getting Document Summary", error?.toString());
    } finally {
      set({ responseLoading: false });
    }
  },
}));

export default useStore;

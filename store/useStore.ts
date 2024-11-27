import { create } from "zustand";
import {
  GoogleSignin,
  isSuccessResponse,
  User,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { Content, GoogleGenerativeAI } from "@google/generative-ai";
import RNFS from "react-native-fs";
import {
  documentPrompt,
  getHearingAdvicePrompt,
  getResearchFindingsPrompt,
  initialPrompt,
  newCasePrompt,
  predictionPrompt,
  summaryPrompt,
} from "@/utils/constants/prompts";

import { Alert, ToastAndroid } from "react-native";
import { clearMarkdown } from "@/utils/utils";
import {
  CaseData,
  CaseFiling,
  CasePrediction,
  ChatItem,
  DocumentAnalysis,
  LegalResearch,
  UserData,
} from "@/global";
import firestore from "@react-native-firebase/firestore";
import { defaultUserData } from "@/utils/constants/defaultUserData";
import { WEB_CLIENT_ID, GEMINI_API_KEY } from "@/Keys";
import { GEMINI_MODEL } from "@/utils/constants/ModelConfig";

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
  casePrediction: CasePrediction | null;
  messageList: ChatItem[];
  caseList: CaseData[];
  currentCase: CaseData | null;
};

type actions = {
  signIn: () => Promise<void>;
  signInSilent: () => Promise<void>;
  signOut: () => Promise<void>;
  getDocumentAnalysis: (file: string) => Promise<void>;
  getDocumentSummary: (lang: string) => Promise<void>;
  getChatResponse: (chatItem: ChatItem) => Promise<void>;
  getCasePrediction: (file: string) => Promise<void>;
  loadInitialPrompt: () => Promise<void>;
  syncUserData: () => Promise<void>;
  initNewCase: (title: string, description: string) => Promise<void>;
  getLegalResearch: (caseData: CaseData) => Promise<void>;
  getHearingAdvice: (caseData: CaseData) => Promise<string>;
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
  messageList: [],
  casePrediction: null,
  caseList: [],
  currentCase: null,

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
            caseList: []
          });
        } else {
          const userData = await userSnapshot.data();
          set({
            userData: userData as UserData,
            caseList: userData?.caseList as CaseData[] || [],
          });
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
        set({
          userData: userData as UserData,
          caseList: userData?.caseList as CaseData[] || [],
        });
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
      set({ user: null, userData: defaultUserData, caseList: [], currentCase: null });
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
        preferences: userData.preferences,
        caseList: get().caseList,
      });
    } catch (error) {
      Alert.alert("Could not sync userData", error as string);
    }
  },

  getDocumentAnalysis: async (file: string) => {
    try {
      set({ responseLoading: true });

      const history = get().contextHistory;
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
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
    set({ responseLoading: true });
    try {
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: {
          responseMimeType: "text/plain",
        },
      });

      const chat = model.startChat({});

      const result = await chat.sendMessage(
        summaryPrompt(lang, get().documentAnalysis!!)
      );
      const response = result.response;
      const text = response.text();
      set({ documentSummary: text });
      set({ documentSummaryLines: clearMarkdown(text).split("\n") });
    } catch (error) {
      Alert.alert("Error Getting Document Summary", error?.toString());
    } finally {
      set({ responseLoading: false });
    }
  },

  getChatResponse: async (chatItem: ChatItem) => {
    try {
      set({ responseLoading: true });

      const history = get().contextHistory;
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: {
          responseMimeType: "text/plain",
        },
      });

      const chat = model.startChat({
        history: history,
      });

      const result = await chat.sendMessage(chatItem.message);
      const response = result.response;
      const text = response.text();

      set({
        messageList: [
          ...get().messageList,
          {
            ai: true,
            message: text.trimEnd(),
            time: new Date().toLocaleTimeString().slice(0, -3),
          },
        ],
      });
    } catch (error) {
      Alert.alert("Unknown Lawbot Error", error as string);
    } finally {
      set({ responseLoading: false });
    }
  },

  loadInitialPrompt: async () => {
    try {
      set({ responseLoading: true });

      const history = get().contextHistory;
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: {
          responseMimeType: "text/plain",
        },
      });

      const chat = model.startChat({
        history: history,
      });

      await chat.sendMessage(initialPrompt);
      set({ contextHistory: history });
    } catch (error) {
      alert(error);
    } finally {
      set({ responseLoading: false });
    }
  },

  getCasePrediction: async (file: string) => {
    try {
      set({ responseLoading: true });

      const history = get().contextHistory;
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
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

      const result = await chat.sendMessage([predictionPrompt, pdf]);
      const response = result.response;
      const text = response.text();

      set({ casePrediction: JSON.parse(text) });
      set({ contextHistory: history });
    } catch (error) {
      Alert.alert("Error Getting Case Prediction", error?.toString());
    } finally {
      set({ responseLoading: false });
    }
  },

  initNewCase: async (title: string, description: string) => {
    try {
      set({ responseLoading: true });

      const history = get().contextHistory;
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const chat = model.startChat({
        history: history,
      });

      const result = await chat.sendMessage(newCasePrompt(title, description));
      const response = result.response;
      const text = response.text();

      const caseFiling: CaseFiling = JSON.parse(text) as CaseFiling;
      const caseData: CaseData = {
        navigateStatus: 0,
        caseFiling: caseFiling,
        evidenceCollection: [],
        legalResearch: [],
        hearingManagement: [],
        caseResolution: null,
      };
      set({ caseList: [...get().caseList, caseData], currentCase: caseData });
      set({ contextHistory: history });
      console.log(caseFiling);
    } catch (error) {
      Alert.alert("Error Initiating a new case", error?.toString());
    } finally {
      set({ responseLoading: false });
    }
  },

  getLegalResearch: async (caseData: CaseData) => {
    try {
      set({ responseLoading: true });

      const history = get().contextHistory;
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const chat = model.startChat({
        history: history,
      });

      const result = await chat.sendMessage(
        getResearchFindingsPrompt(caseData)
      );
      const response = result.response;
      const text = response.text();

      const researchFindings: LegalResearch[] = JSON.parse(
        text
      ) as LegalResearch[];

      set((state) => {
        const { caseList, currentCase } = state;
        if (!currentCase) return state;
        const updatedCaseList = caseList.map((caseItem) =>
          caseItem.caseFiling.caseTitle === currentCase.caseFiling?.caseTitle
            ? { ...caseItem, legalResearch: researchFindings }
            : caseItem
        );
        return {
          ...state,
          currentCase: {
            ...currentCase,
            legalResearch: researchFindings,
          },
          caseList: updatedCaseList,
        };
      });

      set({ contextHistory: history });
      ToastAndroid.show(
        "ResearchFindings are now available!",
        ToastAndroid.SHORT
      );
    } catch (error) {
      Alert.alert("Error Getting research findings", error?.toString());
    } finally {
      set({ responseLoading: false });
    }
  },

  getHearingAdvice: async (caseData: CaseData): Promise<string> => {
    let text: string = "";
    try {
      set({ responseLoading: true });

      const history = get().contextHistory;
      const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        generationConfig: {
          responseMimeType: "text/plain",
        },
      });

      const chat = model.startChat({
        history: history,
      });

      const result = await chat.sendMessage(getHearingAdvicePrompt(caseData));
      const response = result.response;
      text = response.text();
      set({ contextHistory: history });
    } catch (error) {
      Alert.alert("Error Getting Hearing Advice", error?.toString());
    } finally {
      set({ responseLoading: false });
    }
    return text;
  },
}));

export default useStore;

import { create } from "zustand";
import {
  GoogleSignin,
  isSuccessResponse,
  User,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import {
  Content,
  EnhancedGenerateContentResponse,
  GenerateContentResult,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import RNFS from "react-native-fs";
import { documentPrompt, imagePrompt } from "@/constants/prompts";
import { GEMINI_API_KEY, WEB_CLIENT_ID } from "@/Keys";

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID
});

type state = {
  user: User | null;
  contextHistory: Content[];
};

type actions = {
  signIn: () => Promise<void>;
  signInSilent: () => Promise<void>;
  signOut: () => Promise<void>;
  getGeminiResponse: (
    prompt: string,
    mediaType: string, // well, just "file" and "image" for now :)
    media: string | null,
    json?: boolean
  ) => Promise<string>;
};

type loaders = {
  signInSilentLoading: boolean;
};

const useStore = create<state & actions & loaders>((set, get) => ({
  user: null,
  contextHistory: [],

  signInSilentLoading: false,

  signIn: async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        set({ user: response?.data });
        router.navigate(`/Home`);
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
      set({ user: null });
    } catch (error) {
      console.log(error);
    }
  },

  getGeminiResponse: async (
    prompt: string,
    mediaType: string,
    media: string | null,
    json: boolean = false
  ): Promise<string> => {
    try {
      const history = get().contextHistory;
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: json ? "application/json" : "text/plain",
        },
      });

      const chat = model.startChat({
        history: history,
      });

      let result: GenerateContentResult;

      if (mediaType === "file" && media) {
        const pdfData = await RNFS.readFile(media, "base64");
        const pdf = {
          inlineData: {
            data: pdfData,
            mimeType: "application/pdf",
          },
        };
        result = await chat.sendMessage([documentPrompt, pdf]);
      } else if (mediaType === "image" && media) {
        const fsImage = await RNFS.readFile(media, "base64");
        const img = {
          inlineData: {
            data: fsImage,
            mimeType: "image/png",
          },
        };
        result = await chat.sendMessage([json ? imagePrompt : prompt, img]);
      } else {
        result = await chat.sendMessage(prompt);
      }

      const response = result.response;
      const text = response.text();

      set({ contextHistory: history });
      return text;
    } catch (error) {
      console.error(error);
      return "";
    }
  },
}));

export default useStore;

import { create } from "zustand";
import {
  GoogleSignin,
  isSuccessResponse,
  User,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";
import { Content, GoogleGenerativeAI } from "@google/generative-ai";
import RNFS from "react-native-fs";

GoogleSignin.configure({
  webClientId: process.env.WEB_CLIENT_ID,
});

type state = {
  user: User | null;
  contextHistory: Content[];
};

type actions = {
  signIn: () => Promise<void>;
  signInSilent: () => Promise<void>;
  signOut: () => Promise<void>;
  getGeminiResponse: (filePath: string) => Promise<string>;
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
      set({ user: null });
      router.dismissAll();
    } catch (error) {
      console.log(error);
    }
  },

  getGeminiResponse: async (filePath: string): Promise<string> => {
    try {
      const pdfData = await RNFS.readFile(filePath, "base64");
      const history = get().contextHistory;
      const genAI = new GoogleGenerativeAI(
        "AIzaSyBBcXPAEElnI6edh7j0e_4gbWwMS0OmRxQ"
      );
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        },
      });

      const chat = model.startChat({
        history: history,
      });

      const pdf = {
        inlineData: {
          data: pdfData,
          mimeType: "application/pdf",
        },
      };
      const result = await chat.sendMessage([
        `Analyze the following legal document and extract all key information that a user should know, including terms, obligations, conditions, and potential risks. Highlight any clauses or terms that could be unfavorable, hidden, or misleading, and flag them as 'concerning' or 'shady' if applicable. Summarize the key takeaways clearly and list any specific actions the user should take
        
        Return the response the following JSON response

        {
          \"document_name\": \"\",
          \"document_type\": \"\",
          \"parties_involved\": [],
          \"effective_date\": \"\",
          \"termination_date\": \"\",
          \"key_terms\": {
            \"description\": \"\",
            \"terms\": [
              {
                \"term\": \"\",
                \"importance\": \"\"
              }
            ]
          },
          \"obligations\": [
            {
              \"obligation\": \"\",
              \"description\": \"\",
              \"due_date\": null
            }
          ],
          \"risks\": {
            \"general\": [
              {
                \"risk\": \"\",
                \"impact\": \"\",
                \"likelihood\": \"\",
                \"concerning\": false
              }
            ],
            \"legal\": [],
            \"financial\": [],
            \"reputational\": []
          },
          \"shady_clauses\": [
            {
              \"clause\": \"\",
              \"description\": \"\",
              \"reason\": \"\",
              \"potential_impact\": \"\"
            }
          ],
          \"action_items\": [
            {
              \"action\": \"\",
              \"deadline\": null
            }
          ],
          \"dispute_resolution\": {
            \"method\": \"\",
            \"jurisdiction\": \"\"
          },
          \"termination_conditions\": [],
          \"review_recommendations\": \"\",
          \"user_protection_tips\": \"\",
          \"overall_analysis\": \"\"
        }
        `,
        pdf,
      ]);

      const response = result.response;
      const text = response.text();

      set({ contextHistory: history });
      return text;
    } catch (error) {
      console.error("Error uploading PDF:", error);
      return "";
    }
  },
}));

export default useStore;

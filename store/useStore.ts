import { create } from "zustand";
import {
  GoogleSignin,
  isSuccessResponse,
  User,
} from "@react-native-google-signin/google-signin";
import { router } from "expo-router";

GoogleSignin.configure({
  webClientId: process.env.WEB_CLIENT_ID,
});

type state = {
  user: User | null;
};

type actions = {
  signIn: () => Promise<void>;
  signInSilent: () => Promise<void>;
  signOut: () => Promise<void>
};

type loaders = {
  signInSilentLoading: boolean;
};

const useStore = create<state & actions & loaders>((set, get) => ({
  user: null,

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

  signOut: async() => {
    try {
      await GoogleSignin.signOut()
      set({user:null})
      router.dismissAll()
    } catch (error) {
      console.log(error)
    }
  }
}));

export default useStore;

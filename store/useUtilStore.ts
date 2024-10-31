import { create } from "zustand";

type actions = {
  getGreeting: () => string;
};

type state = {
  
}

const useUtilStore = create<actions & state>((set, get) => ({
  
  getGreeting: () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  },
}));

export default useUtilStore

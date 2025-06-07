import { create } from "zustand";

interface HomeStore {
  category: string[];
  setCategory: (category: string[]) => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
  category: ["daily", "hosoop", "work"],
  setCategory: (category) => set({ category }),
}));

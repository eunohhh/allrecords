import type { Category } from "@/types/allrecords.types";
import { create } from "zustand";

interface HomeStore {
  category: Category[];
  setCategory: (category: Category[]) => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
  category: ["ilsang", "poolsoop", "grim"],
  setCategory: (category) => set({ category }),
}));

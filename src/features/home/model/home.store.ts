import { create } from "zustand";
import type { Category } from "@/types/allrecords.types";

interface HomeStore {
  category: Category[];
  setCategory: (category: Category[]) => void;
}

export const useHomeStore = create<HomeStore>((set) => ({
  category: ["ilsang", "poolsoop", "grim"] as Category[],
  setCategory: (category) => set({ category }),
}));

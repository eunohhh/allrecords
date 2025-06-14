import { create } from "zustand";

interface AdminStore {
  category: string[];
  setCategory: (category: string[]) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  category: ["daily", "hosoop", "work"],
  setCategory: (category) => set({ category }),
}));

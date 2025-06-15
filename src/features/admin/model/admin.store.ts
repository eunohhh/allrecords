import type { Record } from "@/types/allrecords.types";
import { create } from "zustand";

interface AdminStore {
  category: string[];
  setCategory: (category: string[]) => void;
  selectedItem: Record | null;
  setSelectedItem: (selectedItem: Record | null) => void;
  selectedItems: Record[];
  setSelectedItems: (selectedItem: Record) => void;
  deleteSelectedItems: (selectedItem: Record) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  category: ["daily", "hosoop", "work"],
  setCategory: (category) => set({ category }),
  selectedItem: null,
  setSelectedItem: (selectedItem) => set({ selectedItem }),
  selectedItems: [],
  setSelectedItems: (selectedItem) =>
    set((state) => ({
      selectedItems: [...state.selectedItems, selectedItem],
    })),
  deleteSelectedItems: (selectedItem) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter(
        (item) => item.id !== selectedItem.id
      ),
    })),
  isModalOpen: false,
  setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
}));

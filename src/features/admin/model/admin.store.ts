import type { Category, Desc, Record } from "@/types/allrecords.types";
import { create } from "zustand";

interface AdminStore {
  category: Category[];
  setCategory: (category: Category[]) => void;
  aboutCategory: string[];
  setAboutCategory: (aboutCategory: string[]) => void;
  selectedDesc: Desc | null;
  setSelectedDesc: (selectedDesc: Desc | null) => void;
  selectedDescs: Desc[];
  setSelectedDescs: (selectedDescs: Desc) => void;
  selectedItem: Record | null;
  setSelectedItem: (selectedItem: Record | null) => void;
  selectedItems: Record[];
  setSelectedItems: (selectedItem: Record) => void;
  deleteSelectedItems: (selectedItem: Record) => void;
  deleteSelectedDescs: (selectedDesc: Desc) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  category: ["ilsang", "poolsoop", "grim"] as Category[],
  setCategory: (category) => set({ category }),
  aboutCategory: ["about"],
  setAboutCategory: (aboutCategory) => set({ aboutCategory }),
  selectedDesc: null,
  setSelectedDesc: (selectedDesc) => set({ selectedDesc }),
  selectedDescs: [],
  setSelectedDescs: (selectedDescs) =>
    set((state) => ({
      selectedDescs: [...state.selectedDescs, selectedDescs],
    })),
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
  deleteSelectedDescs: (selectedDesc) =>
    set((state) => ({
      selectedDescs: state.selectedDescs.filter(
        (desc) => desc.id !== selectedDesc.id
      ),
    })),
  isModalOpen: false,
  setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
}));

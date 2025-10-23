import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { categoryApi, CategoryEntity, CreateCategoryRequest, UpdateCategoryRequest, PagedRequest, PagedList } from '../api';

// Types cho Category Store
interface CategoryState {
  // State
  selectedCategory: CategoryEntity | null;

  // Actions
  setSelectedCategory: (category: CategoryEntity | null) => void;
  clearSelectedCategory: () => void;
}

export const useCategoryStore = create<CategoryState>()(
  devtools(
    (set) => ({
      // Initial state
      selectedCategory: null,

      // Actions
      setSelectedCategory: (category: CategoryEntity | null) => {
        set({ selectedCategory: category });
      },

      clearSelectedCategory: () => {
        set({ selectedCategory: null });
      },
    }),
    {
      name: 'category-store'
    }
  )
);

// Selector hooks
export const useCategoryState = () => useCategoryStore((state) => ({
  selectedCategory: state.selectedCategory,
}));

export const useCategoryActions = () => useCategoryStore((state) => ({
  setSelectedCategory: state.setSelectedCategory,
  clearSelectedCategory: state.clearSelectedCategory,
}));

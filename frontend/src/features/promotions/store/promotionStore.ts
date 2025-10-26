import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { promotionApi, PromotionEntity, CreatePromotionRequest, UpdatePromotionRequest, PromotionFilterParams, PagedList } from '../api';

// Types cho Promotion Store
interface PromotionState {
  // State
  selectedPromotion: PromotionEntity | null;

  // Actions
  setSelectedPromotion: (promotion: PromotionEntity | null) => void;
  clearSelectedPromotion: () => void;
}

export const usePromotionStore = create<PromotionState>()(
  devtools(
    (set) => ({
      // Initial state
      selectedPromotion: null,

      // Actions
      setSelectedPromotion: (promotion: PromotionEntity | null) => {
        set({ selectedPromotion: promotion });
      },

      clearSelectedPromotion: () => {
        set({ selectedPromotion: null });
      },
    }),
    {
      name: 'promotion-store'
    }
  )
);

// Selector hooks
export const usePromotionState = () => usePromotionStore((state) => ({
  selectedPromotion: state.selectedPromotion,
}));

export const usePromotionActions = () => usePromotionStore((state) => ({
  setSelectedPromotion: state.setSelectedPromotion,
  clearSelectedPromotion: state.clearSelectedPromotion,
}));

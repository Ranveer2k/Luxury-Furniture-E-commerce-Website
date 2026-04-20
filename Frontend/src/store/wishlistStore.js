import { create } from 'zustand';
import { wishlistService } from '../services/index';

export const useWishlistStore = create((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const response = await wishlistService.getWishlist();
      set({ items: response.items || [] });
      return response;
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addToWishlist: async (productId) => {
    set({ isLoading: true });
    try {
      const response = await wishlistService.addToWishlist({ productId });
      set({ items: response.items || [] });
      return response;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeFromWishlist: async (itemId) => {
    set({ isLoading: true });
    try {
      const response = await wishlistService.removeFromWishlist(itemId);
      set({ items: response.items || [] });
      return response;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  isInWishlist: (productId) => {
    const { items } = get();
    return items.some(item => item._id === productId);
  },
}));

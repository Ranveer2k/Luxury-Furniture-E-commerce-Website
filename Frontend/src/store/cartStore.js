import { create } from 'zustand';
import { cartService } from '../services/index';

export const useCartStore = create((set, get) => ({
  items: [],
  total: 0,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await cartService.getCart();
      set({ items: response.items || [], total: response.total || 0 });
      return response;
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity) => {
    set({ isLoading: true });
    try {
      const response = await cartService.addToCart({ productId, quantity });
      set({ items: response.items || [], total: response.total || 0 });
      return response;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeFromCart: async (itemId) => {
    set({ isLoading: true });
    try {
      const response = await cartService.removeFromCart(itemId);
      set({ items: response.items || [], total: response.total || 0 });
      return response;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCartItem: async (itemId, quantity) => {
    set({ isLoading: true });
    try {
      const response = await cartService.updateCartItem(itemId, { quantity });
      set({ items: response.items || [], total: response.total || 0 });
      return response;
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await cartService.clearCart();
      set({ items: [], total: 0 });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getCartTotal: () => {
    const { items } = get();
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },
}));

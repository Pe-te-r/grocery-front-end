// store.ts
import type { CartState } from '@/util/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_CART_ITEMS = 20;
const MAX_TOTAL_ITEMS = 50;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product) => {
        const { items } = get();

        // Check if product already exists in cart
        const existingItem = items.find(item => item.id === product.id);

        if (existingItem) {
          // Don't exceed available stock
          const newQuantity = Math.min(existingItem.quantity + 1, product.stock);
          return set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            )
          });
        }

        // Check cart limits before adding new item
        if (items.length >= MAX_CART_ITEMS) {
          alert(`Cart limit reached. You can have maximum ${MAX_CART_ITEMS} different items in your cart.`);
          return;
        }

        if (get().getTotalItems() >= MAX_TOTAL_ITEMS) {
          alert(`Total items limit reached. You can have maximum ${MAX_TOTAL_ITEMS} items in your cart.`);
          return;
        }

        // Add new item with quantity 1
        set({
          items: [
            ...items,
            {
              id: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl,
              quantity: 1,
              stock: product.stock,
              store_id: product.store.id
            }
          ]
        });
      },

      removeFromCart: (productId) => {
        set({ items: get().items.filter(item => item.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        const { items } = get();

        set({
          items: items.map(item => {
            if (item.id === productId) {
              // Don't allow quantity less than 1 or more than available stock
              const newQuantity = Math.max(1, Math.min(quantity, item.stock));
              return { ...item, quantity: newQuantity };
            }
            return item;
          })
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + (parseFloat(item.price) * item.quantity);
        }, 0);
      }
    }),
    {
      name: 'shopping-cart-storage', // unique name for localStorage
      // Optional: You can serialize/deserialize if needed
      // serialize: (state) => JSON.stringify(state),
      // deserialize: (str) => JSON.parse(str),
    }
  )
);
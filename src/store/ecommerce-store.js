import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Zustand Store para el E-commerce
 * Maneja:
 * - Estado del visitante validado
 * - Items del carrito
 * - Cantidades de productos
 * - Cupón aplicado
 * - Totales
 * - Datos de órdenes
 */

const ecommerceStore = create(
  persist(
    (set, get) => ({
  recalculateLocalPricing: (cartItems) => {
    const { pricing } = get();
    const subtotal = cartItems.reduce(
      (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );
    const discount = Math.min(Number(pricing?.discount || 0), subtotal);
    const final_amount = Math.max(0, subtotal - discount);

    set({
      pricing: {
        subtotal,
        discount,
        final_amount,
      },
    });
  },

  // ===== VISITANTE =====
  visitor: null,
  
  setVisitor: (visitor) => set({ visitor }),
  
  clearVisitor: () => set({ visitor: null }),

  // ===== CARRITO =====
  cart: [], // [{product_id, quantity, name, price}, ...]
  
  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.find((item) => item.product_id === product.product_id);

    if (existingItem) {
      // Si ya existe, incrementar cantidad
      const updatedCart = cart.map((item) =>
        item.product_id === product.product_id
          ? { ...item, quantity: item.quantity + (product.quantity || 1) }
          : item
      );
      set({ cart: updatedCart });
      get().recalculateLocalPricing(updatedCart);
    } else {
      // Si no existe, añadir nuevo
      const updatedCart = [
        ...cart,
        {
          product_id: product.product_id,
          quantity: product.quantity || 1,
          name: product.name,
          price: product.price,
          event_date: product.event_date,
        },
      ];

      set({
        cart: updatedCart,
      });
      get().recalculateLocalPricing(updatedCart);
    }
  },

  removeFromCart: (product_id) => {
    const { cart } = get();
    const updatedCart = cart.filter((item) => item.product_id !== product_id);
    set({
      cart: updatedCart,
    });
    get().recalculateLocalPricing(updatedCart);
  },

  updateCartQuantity: (product_id, quantity) => {
    const { cart } = get();
    if (quantity <= 0) {
      get().removeFromCart(product_id);
    } else {
      const updatedCart = cart.map((item) =>
        item.product_id === product_id ? { ...item, quantity } : item
      );
      set({ cart: updatedCart });
      get().recalculateLocalPricing(updatedCart);
    }
  },

  clearCart: () => {
    set({
      cart: [],
      pricing: {
        subtotal: 0,
        discount: 0,
        final_amount: 0,
      },
    });
  },

  // ===== CUPÓN =====
  coupon: null, // {id_coupon, code, discount_value, ...}
  couponCode: '',
  
  setCoupon: (coupon) => set({ coupon }),
  
  setCouponCode: (code) => set({ couponCode: code }),
  
  clearCoupon: () => set({ coupon: null, couponCode: '' }),

  // ===== PRECIOS Y TOTALES =====
  pricing: {
    subtotal: 0,
    discount: 0,
    final_amount: 0,
  },

  setPricing: (pricing) => set({ pricing }),

  // ===== ÓRDENES =====
  currentOrder: null, // {id_order, paypal_order_id, ...}
  pendingOrder: null, // Orden temporal en cliente antes de persistir en DB
  
  setCurrentOrder: (order) => set({ currentOrder: order }),
  
  clearCurrentOrder: () => set({ currentOrder: null }),

  setPendingOrder: (pendingOrder) => set({ pendingOrder }),

  clearPendingOrder: () => set({ pendingOrder: null }),

  clearCheckoutState: () =>
    set({
      cart: [],
      coupon: null,
      couponCode: '',
      pricing: {
        subtotal: 0,
        discount: 0,
        final_amount: 0,
      },
      currentOrder: null,
      pendingOrder: null,
      error: null,
      success: false,
    }),

  // ===== VALIDACIÓN Y ESTADO =====
  isLoading: false,
  error: null,
  success: false,

  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  setSuccess: (success) => set({ success }),

  clearMessages: () => set({ error: null, success: false }),

  // ===== UTILIDADES =====
  getCartItemCount: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },

  getCartTotal: () => {
    const { pricing } = get();
    return pricing.final_amount || 0;
  },

  getCartItems: () => {
    const { cart } = get();
    return cart;
  },

  // ===== RESET COMPLETO =====
  resetStore: () => {
    set({
      visitor: null,
      cart: [],
      coupon: null,
      couponCode: '',
      pricing: {
        subtotal: 0,
        discount: 0,
        final_amount: 0,
      },
      currentOrder: null,
      pendingOrder: null,
      isLoading: false,
      error: null,
      success: false,
    });
  },

  // ===== PERSISTENCIA (OPCIONAL) =====
  // Para persistir en localStorage:
  // Comentado por ahora, se puede habilitar si se necesita
  /*
  saveState: () => {
    const state = get();
    localStorage.setItem('ecommerce-store', JSON.stringify({
      visitor: state.visitor,
      cart: state.cart,
      coupon: state.coupon,
      couponCode: state.couponCode,
    }));
  },

  loadState: () => {
    const saved = localStorage.getItem('ecommerce-store');
    if (saved) {
      const parsed = JSON.parse(saved);
      set(parsed);
    }
  },
  */
    }),
    {
      name: 'ecommerce-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        visitor: state.visitor,
        cart: state.cart,
        coupon: state.coupon,
        couponCode: state.couponCode,
        pricing: state.pricing,
        currentOrder: state.currentOrder,
        pendingOrder: state.pendingOrder,
      }),
    }
  )
);

export default ecommerceStore;

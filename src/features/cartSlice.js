import { createSlice } from "@reduxjs/toolkit";

// Helper function to get cart from localStorage
const getCartFromLocalStorage = () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return {
    items: cart,
    totalCount: cart.reduce((total, item) => total + (item.quantity || 0), 0),
  };
};

const initialState = getCartFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add item to cart
    addToCart: (state, action) => {
      const { productId, name, price, image, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.productId === productId);

      if (existingItem) {
        // If the item already exists, update its quantity
        existingItem.quantity += quantity;
      } else {
        // If the item doesn't exist, add it to the cart
        state.items.push({ productId, name, price, image, quantity });
      }

      // Update total count
      state.totalCount = state.items.reduce((total, item) => total + item.quantity, 0);

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    // Remove one item from cart
    removeOneFromCart: (state, action) => {
      const productId = action.payload;
      const existingItem = state.items.find((item) => item.productId === productId);

      if (existingItem) {
        if (existingItem.quantity > 1) {
          // If quantity is more than 1, decrement the quantity
          existingItem.quantity -= 1;
        } else {
          // If quantity is 1, remove the item from the cart
          state.items = state.items.filter((item) => item.productId !== productId);
        }

        // Update total count
        state.totalCount = state.items.reduce((total, item) => total + item.quantity, 0);

        // Save to localStorage
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },

    // Remove all of a product from cart
    removeProductFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.productId !== productId);

      // Update total count
      state.totalCount = state.items.reduce((total, item) => total + item.quantity, 0);

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    // Clear the entire cart
    clearCart: (state) => {
      state.items = [];
      state.totalCount = 0;

      // Clear localStorage
      localStorage.removeItem("cart");
    },

    // Set the cart from localStorage or other source
    setCart: (state, action) => {
      state.items = action.payload;
      state.totalCount = action.payload.reduce((total, item) => total + item.quantity, 0);

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
  },
});

export const {
  addToCart,
  removeOneFromCart,
  removeProductFromCart,
  clearCart,
  setCart, // Export the new setCart action
} = cartSlice.actions;

export default cartSlice.reducer;
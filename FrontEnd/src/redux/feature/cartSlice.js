import { createSlice } from "@reduxjs/toolkit";

const data = []

const cartSlice = createSlice({
    name: "post",
    initialState: {
      items: data,
      totalAmount: 0,
      totalCount: 0,
    },
  
    reducers: {
      getCartTotal: (state, action) => {
        let { totalAmount, totalCount } = state.items.reduce(
          (cartTotal, cartItem) => {
            const { price, quantity } = cartItem;
            const itemTotal = price * quantity;
  
            cartTotal.totalAmount += itemTotal;
            cartTotal.totalCount += quantity;
            return cartTotal;
          },
          {
            totalAmount: 0,
            totalCount: 0,
          }
        );
        state.totalAmount = totalAmount;
        state.totalCount = totalCount
      },
      remove: (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      },
      increase: (state, action) => {
        state.items = state.items.map((item) => {
          if (item.id === action.payload && item.quantity < 10) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      },
      decrease: (state, action) => {
        state.items = state.items
          .map((item) => {
            if (item.id === action.payload) {
              return { ...item, quantity: item.quantity - 1 };
            }
            return item;
          })
          .filter((item) => item.quantity !== 0);
      },
      clearCart: (state, action) => {
        state.items = [];
      },
      addToCart: (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);

        if (index !== -1) {
          // If the item is found, update its quantity
          state.items[index].quantity += action.payload.quantity;
        } else {
          // If the item is not found, insert the new item
          state.items.push(action.payload);
        }
      },
      setCartItems: (state, action) => {
        state.items = action.payload.data;
      },
    },
  });
  
  export const {
    getCartTotal,
    remove,
    increase,
    decrease,
    clearCart,
    setCartItems,
    addToCart,
  } = cartSlice.actions;
  
  export default cartSlice.reducer;
import { createContext } from "react";

export const CartContext = createContext();

export const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.find(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size
      );

      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, qty: item.qty + action.payload.qty }
            : item
        );
      } else {
        return [...state, action.payload];
      }

    case "REMOVE_FROM_CART":
      // FIX: Remove only the product with the specific size
      return state.filter(
        (item) =>
          !(item.id === action.payload.id && item.size === action.payload.size)
      );

    case "SYNC_CART":
      return action.payload;

    case "UPDATE_QUANTITY":
      // FIX: Update qty only for the item with the same id AND size
      return state.map((item) =>
        item.id === action.payload.id && item.size === action.payload.size
          ? { ...item, qty: action.payload.qty }
          : item
      );

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

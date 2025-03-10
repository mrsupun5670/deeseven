import { createContext } from "react";

export const CartContext = createContext();

export const cartReducer = (state, action) => {
    
    switch(action.type) {
        case "ADD_TO_CART":
            const existingItem = state.find((item) => item.id === action.payload.id);
            state.find((item) => console.log("item :", item));
            if (existingItem) {
                return state.map((item) => 
                    item.id === action.payload.id ? { ...item, qty: item.qty + action.payload.qty, 
                        price: state[0].price + action.payload.price } : item
                );
            } else {
                return [...state, action.payload]
            }
        case "REMOVE_FROM_CART":
            return state.filter((item) => item.id !== action.payload);
        case "UPDATE_QUANTITY":
            return state.map((item) => 
                item.id === action.payload.id ? { ...item, qty:action.payload.qty } : item
            );
        case "CLEAR_CART":
            return [];
        default: 
            return state;
    }
}
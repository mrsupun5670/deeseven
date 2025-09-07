import { useContext, useEffect, useReducer } from "react";
import { CartContext, cartReducer } from "./CartContext";

export default function CartProvider  ({  children }) {
    const [cart, dispatch] = useReducer(cartReducer, [], () => {
        const savedCart = sessionStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        sessionStorage.setItem("cart", JSON.stringify(cart));
    }, [cart])

    return(
        <CartContext.Provider value={{ cart, dispatch }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext);
import React from "react";
import { X, Minus, Plus, Share } from "lucide-react";
import { useCart } from "../context/CartProvider";

function CartComponent({ onClose }) {
  const { cart, dispatch } = useCart();

  const updateQuantity = (id, change) => {
    if(change < 1) return;
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id, qty: change },
    });
  };

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="fixed top-0 right-0 bottom-24 md:bottom-0 w-1/4 min-w-[350px] bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-medium">My Cart</h2>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-full">
          <Share className="w-5 h-5" />
        </button>
      </div>

      {/* Free Shipping Banner */}
      <div className="bg-gray-50 p-2 text-center text-sm">
        <p className="text-purple-600 font-medium">CONGRATS! FREE SHIPPING UNLOCKED</p>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex gap-4">
            <img
              src={item.image}
              alt={item.title}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-gray-500 text-sm text-start">{item.size}</p>
                  <p className="mt-1 text-start">LKR {(item.price * item.qty).toLocaleString()}

                  </p>
                </div>
                <button
                  className="p-1 hover:bg-gray-100 rounded-full h-fit"
                  onClick={() => removeItem(item.id)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="p-1 hover:bg-gray-100 rounded-full"
                  onClick={() => updateQuantity(item.id, item.qty - 1)}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span>{item.qty}</span>
                <button
                  className="p-1 hover:bg-gray-100 rounded-full"
                  onClick={() => updateQuantity(item.id, item.qty + 1)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total and Checkout */}
      <div className="p-4 border-t space-y-4">
        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-medium">LKR {total.toLocaleString()}</span>
        </div>
        <button className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800">
          CHECKOUT
        </button>
        <button className="w-full py-3 text-center hover:bg-gray-100 rounded"
        onClick={onClose}>
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
}

export default CartComponent;
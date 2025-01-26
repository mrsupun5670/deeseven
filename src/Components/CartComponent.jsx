import React from "react";
import { X } from "lucide-react";

function CartComponent({ onClose, items = [] }) {
  // Calculate the total price
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-3xl w-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <h2 className="text-2xl font-semibold">Your Cart</h2>
        <button
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="p-6 space-y-4 overflow-y-auto max-h-96">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">Your cart is empty.</p>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 border-t">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Total:</h3>
          <p className="text-xl font-bold">${totalPrice.toFixed(2)}</p>
        </div>
        <button
          className="w-full bg-[#ffb700] text-black font-medium py-3 rounded-full hover:bg-yellow-500 transition-colors"
          disabled={items.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default CartComponent;

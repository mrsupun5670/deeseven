import React, {useState} from "react";
import { X, Minus, Plus, Share } from "lucide-react";

function CartComponent({ onClose }) {

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Fearless Tee - Unisex',
      variant: 'Jet Black / XS',
      price: 3950,
      quantity: 1,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ6FMldDBgU1fzSw1UzJCy4wYdOBZNfVhMwA&s'
    },
    {
      id: 2,
      name: 'Globe Stride Baby Tee',
      variant: 'Sheer White / S',
      price: 4450,
      quantity: 1,
      image: 'https://rough.lk/wp-content/uploads/2023/11/0338-Navy-Blue-M.jpg'
    },
    {
      id: 3,
      name: 'Astro Tee V2 - Oversize - Unisex',
      variant: 'Alpine Green / XS',
      price: 3950,
      quantity: 2,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScJNbz5buuBAKcvcQAJz9d3db7Nf0qXnPqhQ&s'
    }
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className="fixed top-0 right-0 bottom-24 md:bottom-0  w-1/4 min-w-[350px]  bg-white shadow-lg flex flex-col">
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
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4">
            <img 
              src={item.image}
              alt={item.name}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-500 text-sm text-start">{item.variant}</p>
                  <p className="mt-1 text-start">LKR {item.price.toLocaleString()}</p>
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
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span>{item.quantity}</span>
                <button 
                  className="p-1 hover:bg-gray-100 rounded-full"
                  onClick={() => updateQuantity(item.id, 1)}
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
          <span className="font-medium">LKR 1000.00</span>
        </div>
        <button className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800">
          CHECKOUT
        </button>
        <button className="w-full py-3 text-center hover:bg-gray-100 rounded">
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
}

export default CartComponent;

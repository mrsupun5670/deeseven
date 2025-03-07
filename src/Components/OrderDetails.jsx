import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Minus, Plus, X } from "lucide-react";

export default function OrderDetails() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Fearless Tee - Unisex",
      variant: "Jet Black / XS",
      price: 3950,
      quantity: 1,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ6FMldDBgU1fzSw1UzJCy4wYdOBZNfVhMwA&s",
    },
    {
      id: 2,
      name: "Globe Stride Baby Tee",
      variant: "Sheer White / S",
      price: 4450,
      quantity: 1,
      image: "https://rough.lk/wp-content/uploads/2023/11/0338-Navy-Blue-M.jpg",
    },
    {
      id: 3,
      name: "Astro Tee V2 - Unisex",
      variant: "Alpine Green / XS",
      price: 3950,
      quantity: 2,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScJNbz5buuBAKcvcQAJz9d3db7Nf0qXnPqhQ&s",
    },
  ]);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsCollapsed(false);
    }
  }, []);

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Order Details</h2>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded bg-gray-200 hover:bg-gray-300 transition"
        >
          {isCollapsed ? (
            <ChevronDownIcon className="w-3 h-3 text-gray-700" />
          ) : (
            <ChevronUpIcon className="w-3 h-3 text-gray-700" />
          )}
        </button>
      </div>
      {!isCollapsed && (
        <div className="mt-2">
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
                      <p className="text-gray-500 text-sm text-start">
                        {item.variant}
                      </p>
                      <p className="mt-1 text-start">
                        LKR {item.price.toLocaleString()}
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
                    <span>x</span>
                    <span>{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <hr className="border-t border-gray-300 opacity-50 mb-4 mt-2" />

      <div className="flex flex-row justify-between">
        <p>SUBTOTAL</p>
        <p>Rs. 2500.00</p>
      </div>

      <div className="flex flex-row justify-between">
        <p>SHIPPING</p>
        <p>Rs. 200.00</p>
      </div>

      <hr className="border-t border-gray-300 opacity-50 mt-4 mb-4" />

      <div className="flex flex-row justify-between font-bold">
        <p>TOTAL</p>
        <p>Rs. 2700.00</p>
      </div>
     
    </div>
  );
}

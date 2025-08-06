import React, { useEffect, useState } from "react";
import { X, Minus, Plus, Share } from "lucide-react";
import { useCart } from "../context/CartProvider";
import { useNavigate } from "react-router";
import HashLoader from "react-spinners/HashLoader";
import { toast, ToastContainer } from "react-toastify";

function CartComponent({ onClose }) {
  const APIURL = import.meta.env.VITE_API_URL;

  const { cart, dispatch } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [storedUserId, setStoredUserId] = useState(null);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    // Check if user is logged in
    if (storedUser) {
      syncCartWithDatabase(storedUser.id);
      setStoredUserId(storedUser.id);
    }  
  }, []);

  const syncCartWithDatabase = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`${APIURL}/fetchCartItems.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await response.json();
      if (data.status) {
        dispatch({ type: "SYNC_CART", payload: data.cart });
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantityInDatabase = async (product_id, size, newQty) => {
    try {
      const response = await fetch(`${APIURL}/UpdateCartQuantity.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: storedUserId,
          product_id: product_id,
          size: size,
          quantity: newQty
        }),
      });

      const data = await response.json();
      
      if (!data.status) {
        console.error("Failed to update quantity in database");
      }
    } catch (error) {
      console.error("Error updating quantity in database:", error);
    }
  };

  const removeItemFromDatabase = async (storedUserId, product_id, size) => {
    try {
      const response = await fetch(`${APIURL}/RemoveCartItems.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: storedUserId,
          size: size,
          product_id: product_id,
        }),
      });

      const data = await response.json();

      if (data.status) {
        dispatch({ type: "REMOVE_FROM_CART",
          payload: {
            product_id,
            size,
          }, });
      }
    } catch (error) {
      console.error("Error removing item from database:", error);
    }
  };

  const handleClick = (item) => {
    setLoading(true);

    setTimeout(() => {
      navigate(`/product/${item.id}`);
      setLoading(false);
    }, 500);
  };

  const updateQuantity = (id, size, maxQty, newQty) => {
    if (newQty < 1) return;
    if(newQty > maxQty) return;

    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { id, size, qty: newQty },
    });

    if (storedUserId) {
      const item = cart.find(item => item.id === id && item.size === size);
      if (item && item.product_id) {
        updateQuantityInDatabase(item.product_id, size, newQty);
      }
    }

  };

  const removeItem = (id, product_id, size) => {
    
    if (storedUserId) {
      removeItemFromDatabase(storedUserId, product_id, size);
    }
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: {
        id,
        size,
      },
    });
  };

  const checkout = () => {
      if(cart.length == 0) {
        return;
      } else {
        if(!storedUserId) {
          toast.error("please Sign in to continue", {theme: "colored"});
        } else {
          
          navigate("/checkout", {state: { userID: storedUserId}});
        }
      }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div
      className="fixed top-36 md:top-20 right-0 bottom-24 md:bottom-0 w-1/4 min-w-[350px] bg-white shadow-lg flex flex-col 
      transition-transform duration-300 ease-in-out"
    >
      {/* Header */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <HashLoader
            color="#FFB700"
            loading={loading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-medium">My Cart</h2>
          </div>
        </div>
      )}
      {/* Free Shipping Banner */}
      {/* <div className="bg-gray-50 p-2 text-center text-sm">
        <p className="text-purple-600 font-medium">
          CONGRATS! FREE SHIPPING UNLOCKED
        </p>
      </div> */}

      {/* Cart Items */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {cart.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div
              onClick={() => handleClick(item)}
              className="relative w-24 h-24 rounded cursor-pointer overflow-hidden"
            >
              <img
                src={storedUser? APIURL +"/"+ item.image: item.image}
                alt={item.title}
                className="w-full h-full object-contain"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-70 transition-opacity"></div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-start">{item.title}</h3>
                  <p className="text-gray-500 text-sm text-start">
                    {item.size}
                  </p>
                  <p className="mt-1 text-start">
                    LKR {(item.price * item.qty).toLocaleString()}
                  </p>
                </div>
                <div>
                  <button
                    className="p-1 hover:bg-gray-100 rounded-full h-fit"
                    onClick={() => removeItem(item.id, item.product_id, item.size)}                
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded-full">
                    <Share className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  className="p-1 hover:bg-gray-100 rounded-full"
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.maxQty, item.qty - 1)
                  }
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span>{item.qty}</span>
                <button
                  className="p-1 hover:bg-gray-100 rounded-full"
                  onClick={() =>
                    updateQuantity(item.id, item.size, item.maxQty, item.qty + 1)
                  }
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
        <button onClick={checkout} className="w-full bg-black text-white py-3 rounded font-medium hover:bg-gray-800">
          CHECKOUT
        </button>
        <ToastContainer />
        <button
          className="w-full py-3 text-center hover:bg-gray-100 rounded"
          onClick={onClose}
        >
          CONTINUE SHOPPING
        </button>
      </div>
    </div>
  );
}

export default CartComponent;

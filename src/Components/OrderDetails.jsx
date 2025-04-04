import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import HashLoader from "react-spinners/HashLoader";

export default function OrderDetails({ userID, setTotalAmount, setOrderItems }) {
  const APIURL = import.meta.env.VITE_API_URL;

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${APIURL}/GetDBCartItem.php?id=${userID}`
        );
        const data = await response.json();
        if (data.status) {
          setCartItems(data.data);
          setOrderItems(data.data);
          setLoading(false);
          // setMainImage(`${APIURL}/${data.data.images[0].image_url}`);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsCollapsed(false);
    }
  }, []);

  const subTotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const shipping = 200;

  const total = subTotal + shipping;

  useEffect(() => {
    setTotalAmount(total)
  }, [total, setTotalAmount])

  return (
    <>
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
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <img
                      src={`${APIURL}/${item.image}`}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-gray-500 text-sm text-start">
                            {item.size}
                          </p>
                          <p className="mt-1 text-start">
                            LKR {item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span>x</span>
                        <span>{item.qty}</span>
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
            <p>Rs. {subTotal.toFixed(2)}</p>
          </div>

          <div className="flex flex-row justify-between">
            <p>SHIPPING</p>
            <p>Rs. {shipping.toFixed(2)}</p>
          </div>

          <hr className="border-t border-gray-300 opacity-50 mt-4 mb-4" />

          <div className="flex flex-row justify-between font-bold">
            <p>TOTAL</p>
            <p>Rs. {(subTotal + shipping).toFixed(2)}</p>
          </div>
        </div>
      )}
    </>
  );
}

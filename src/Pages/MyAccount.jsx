import "../global.css";
import Header from "../Components/Header";
import BottomNavBar from "../Components/BottomNavBar";
import { useEffect, useState } from "react";
import OrderItemTable from "../Components/OrderItemTable";
import { Mail, Phone } from "lucide-react";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartProvider";

export default function MyAccount() {
  if (localStorage.getItem("user") == null) {
    window.location.href = "/";
    return;
  }

  const APIURL = import.meta.env.VITE_API_URL;

  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const { dispatch } = useCart();

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      try {
        const fetchOrders = async () => {
          const response = await fetch(
            `${APIURL}/FetchOrders.php?id=${user.id}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
              },
            }
          );
          const data = await response.json();
          if (data.status) {
            setOrders(data.data);
          } else {
            console.log(data.message);
          }
        };
        fetchOrders();
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  const handleView = (order) => {
    setSelectedOrder(order);
    setOrderItems(order.items || []);
  };

  const handleBack = () => {
    setSelectedOrder(null);
    setOrderItems([]);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("cart");

    dispatch({
      type: "CLEAR_CART",
      payload: null,
    });

    navigate("/");
  };

  return (
    <div className="bg-gray-200 min-h-screen relative ">
      <Header />
      <div className="container mx-auto md:px-14 p-4 relative z-0">
        <div className="flex flex-row justify-between items-center">
          <p className="font-bold text-2xl">
            {selectedOrder
              ? `Order Details - ${selectedOrder.order_number}`
              : "My Account - Orders"}
          </p>
          <button
            onClick={logout}
            className="mb-4 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
        </div>

        {selectedOrder ? (
          <div className="mt-10">
            <button
              onClick={handleBack}
              className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Back to Orders
            </button>
            <OrderItemTable orderItems={orderItems} />
            {/* {console.log(orderItems)} */}
          </div>
        ) : (
          <div className="overflow-x-auto mt-10">
            <table className="w-full border rounded-lg shadow">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tracking No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total + Shipping (Rs.)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.order_number}>
                      <td className="px-6 py-4">{order.order_number}</td>
                      <td className="px-6 py-4">{order.tracking_number}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full 
                              ${
                                order.order_status
                                  ? "bg-yellow-100 text-yellow-800"
                                  : ""
                              }
                              ${
                                order.order_status
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }
                              ${
                                order.order_status
                                  ? "bg-red-100 text-red-800"
                                  : ""
                              }`}
                        >
                          {order.order_status === 0
                            ? "Pending"
                            : order.order_status === 1
                            ? "Completed"
                            : order.order_status === 2
                            ? "Canceled"
                            : "Processing error"}
                        </span>
                      </td>
                      <td className="px-6 py-4">{order.order_amount}</td>
                      <td className="px-6 py-4">{order.order_date}</td>
                      <td className="px-6 py-4 text-end">
                        <button
                          onClick={() => handleView(order)}
                          className="px-3 py-1 text-gray-600 text:hover:bg-gray-700"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-2">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {orders.length > 0 && (
          <div className="flex flex-col md:flex-row w-full mt-10 gap-4">
            {orders.map((order, index) => (
            <div key={index} className="w-full  bg-white border rounded-md p-8">
              <p className="font-bold text-2xl mb-2">Billing Address</p>
              <p>{order.customer.fname + " " + order.customer.lname},</p>
              <p>{order.billing_address.line1 + "" + order.billing_address.line2},</p>
              <p>{order.billing_address.city}</p>
              <p>{order.billing_address.postal_code}</p>
              <div className="flex flex-row gap-2 items-center">
                <Mail className="w-4 h-4 " />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Phone className="w-4 h-4 " />
                <span>{order.customer.mobile}</span>
              </div>
            </div>
          ))}
            {orders.map((order, index) => (
            <div key={index} className="w-full  bg-white border rounded-md p-8">
              <p className="font-bold text-2xl mb-2">Shipping Address</p>
              <p>{order.customer.fname + " " + order.customer.lname},</p>
              <p>{order.shipping_address.line1 + "" + order.shipping_address.line2},</p>
              <p>{order.shipping_address.city}</p>
              <p>{order.shipping_address.postal_code}</p>
              <div className="flex flex-row gap-2 items-center">
                <Mail className="w-4 h-4 " />
                <span>{order.customer.email}</span>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Phone className="w-4 h-4 " />
                <span>{order.customer.mobile}</span>
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
      <BottomNavBar />
      <Footer />
    </div>
  );
}

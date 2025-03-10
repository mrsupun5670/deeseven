import "../global.css";
import Header from "../Components/Header";
import BottomNavBar from "../Components/BottomNavBar";
import { useState } from "react";
import OrderItemTable from "../Components/OrderItemTable";
import { Mail, Phone } from "lucide-react";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router";

export default function MyAccount() {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      tracking: "1234444",
      status: "Pending",
      total: 4500,
      date: "2025-03-07",
    },
    {
      id: "ORD002",
      tracking: "354235234234",
      status: "Completed",
      total: 8200,
      date: "2025-03-06",
    },
    {
      id: "ORD003",
      tracking: "24543523",
      status: "Canceled",
      total: 3600,
      date: "2025-03-05",
    },
    {
      id: "ORD004",
      tracking: "435234234",
      status: "Pending",
      total: 5000,
      date: "2025-03-04",
    },
    {
      id: "ORD005",
      tracking: "5462725625634",
      status: "Completed",
      total: 12000,
      date: "2025-03-03",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  const sampleOrderItems = {
    ORD001: [
      { id: 1, title: "T-Shirt", size: "M", qty: 2, price: 2000 },
      { id: 2, title: "Cap", size: "Free Size", qty: 1, price: 500 },
    ],
    ORD002: [
      { id: 3, title: "Jeans", size: "32", qty: 1, price: 4000 },
      { id: 4, title: "Shirt", size: "L", qty: 1, price: 4200 },
    ],
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    setOrderItems(sampleOrderItems[order.id] || []);
  };

  const handleBack = () => {
    setSelectedOrder(null);
    setOrderItems([]);
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userRole")
    navigate("/");
  }

  return (
    <div className="bg-gray-200 min-h-screen relative ">
        <div className="relative p-5 z-0">
          <Header />

          <div className="flex flex-row justify-between items-center">
            <p className="font-bold text-2xl">
              {selectedOrder
                ? `Order Details - ${selectedOrder.id}`
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
                      Total (Rs.)
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
                      <tr key={order.id}>
                        <td className="px-6 py-4">{order.id}</td>
                        <td className="px-6 py-4">{order.tracking}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full 
                              ${
                                order.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : ""
                              }
                              ${
                                order.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }
                              ${
                                order.status === "Canceled"
                                  ? "bg-red-100 text-red-800"
                                  : ""
                              }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{order.total}</td>
                        <td className="px-6 py-4">{order.date}</td>
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
          <div className="flex flex-col md:flex-row w-full mt-10 gap-4">
            <div className="w-full  bg-white border rounded-md p-8">
              <p className="font-bold text-2xl mb-2">Billing Address</p>
              <p>Gangani Products,</p>
              <p>Near Jayanthi School,</p>
              <p>Nikaweratiya</p>
              <p>60470</p>
              <div className="flex flex-row gap-2 items-center">
                <Mail className="w-4 h-4 " />
                <span>supun9402@gmail.com</span>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Phone className="w-4 h-4 " />
                <span>+94 77 201 0 915</span>
              </div>
            </div>
            <div className="w-full  bg-white border rounded-md p-8">
              <p className="font-bold text-2xl mb-2">Shipping Address</p>
              <p>Gangani Products,</p>
              <p>Near Jayanthi School,</p>
              <p>Nikaweratiya</p>
              <p>60470</p>
              <div className="flex flex-row gap-2 items-center">
                <Phone className="w-4 h-4 " />
                <span>+94 77 201 0 915</span>
              </div>
            </div>
          </div>
        </div>
        <Footer />
    </div>
  );
}

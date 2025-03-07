import "../global.css";
import Header from "../Components/Header";

import BottomNavBar from "../Components/BottomNavBar";
import { useState } from "react";

export default function MyAccount() {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      customer: "Supun Perera",
      status: "Pending",
      total: 4500,
      date: "2025-03-07",
    },
    {
      id: "ORD002",
      customer: "Kethu Fernando",
      status: "Completed",
      total: 8200,
      date: "2025-03-06",
    },
    {
      id: "ORD003",
      customer: "Dilan Silva",
      status: "Canceled",
      total: 3600,
      date: "2025-03-05",
    },
    {
      id: "ORD004",
      customer: "Amaya Senanayake",
      status: "Pending",
      total: 5000,
      date: "2025-03-04",
    },
    {
      id: "ORD005",
      customer: "Nuwan Rathnayake",
      status: "Completed",
      total: 12000,
      date: "2025-03-03",
    },
  ]);

  return (
    <div className="bg-gray-200 min-h-screen relative flex justify-center">
      <div className="w-full max-w-[1280px]">
        <div className="relative p-5 z-0">
          <Header />

          <div className="flex flex-row ">
            <p className=" font-bold text-3xl">My Account - Orders</p>
          </div>
          <div className="overflow-x-auto mt-10">
            <table className="w-full  rounded-lg shadow ">
              <thead >
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Order ID
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
                          className="px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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
        </div>
        <BottomNavBar />
      </div>
    </div>
  );
}

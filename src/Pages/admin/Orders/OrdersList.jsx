import React, { useState, useEffect, useRef } from "react";
import { Printer } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import OrderItemTable from "../../../Components/OrderItemTable";
import { ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrdersList = () => {
  const APIURL = import.meta.env.VITE_API_URL;

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingLink, setTrackingLink] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [selectedCourier, setSelectedCourier] = useState("");
  const [couriers, setCouriers] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${APIURL}/ListOrdersController.php`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.response === true) {
            setOrders(data.orders);
          } else {
            alert(data.message);
            if (data.message === "Unauthorized") {
              sessionStorage.removeItem("authToken");
              sessionStorage.removeItem("userRole");
              sessionStorage.removeItem("admin");
              window.location.href = "/";
            }
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to load orders. Please try again later.");
      }
    };

    fetchOrders();
  }, []);

  const fetchOrderItems = async (orderId) => {
    try {
      const response = await fetch(
        `${APIURL}/GetOrderItemsController.php?order_id=${orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.response === true) {
          setOrderItems(data.items);
        } else {
          alert(data.message);
        }
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
      alert("Failed to load order items. Please try again later.");
    }
  };

  const handleView = (order) => {
    setSelectedOrder(order);
    fetchOrderItems(order.id);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIsStatusModalOpen(false);
    setSelectedOrder(null);
    setOrderItems([]);
    setTrackingNumber("");
    setTrackingLink("");
    setNewStatus("");
    setSelectedCourier("");
  };

  const handleStatusClick = async (order) => {
    setSelectedOrder(order);
    try {
      const response = await fetch(`${APIURL}/GetOrderStatusController.php?order_id=${order.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response === true) {
          setCouriers(data.couriers);
          setTrackingNumber(data.orderDetails.tracking_number || "");
          setTrackingLink(data.orderDetails.courier_service_link || "");
          setNewStatus(data.orderDetails.status);
          setSelectedCourier(data.orderDetails.courier_service_name || "");
        } else {
          toast.error(data.message, { theme: "light" });
        }
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details. Please try again later.", { theme: "light" });
    }
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(
        `${APIURL}/UpdateOrderStatusController.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            orderId: selectedOrder.id,
            status: newStatus,
            trackingNumber,
            trackingLink,
            courierServiceId: couriers.find(courier => courier.name === selectedCourier)?.id,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.response === true) {
          toast.success("Order status and tracking information updated successfully.", { theme: "light" });
          handleClose();
          const updatedOrders = orders.map((order) =>
            order.id === selectedOrder.id
              ? {
                  ...order,
                  status: newStatus,
                  trackingNumber,
                  trackingLink,
                  courier: selectedCourier,
                }
              : order
          );
          setOrders(updatedOrders);
        } else {
          toast.error(data.message, { theme: "light" });
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status. Please try again later.", { theme: "light" });
    }
  };

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleClose();
    }
  };

  useEffect(() => {
    if (isModalOpen || isStatusModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalOpen, isStatusModalOpen]);

  const printOrders = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Orders Report", 14, 15);

    const tableColumn = [
      "Order ID",
      "Customer",
      "Status",
      "Total (Rs.)",
      "Date",
    ];
    const tableRows = orders.map((order) => [
      "IN" + order.number,
      order.customer,
      order.status,
      order.total,
      order.date,
    ]);

    doc.autoTable({
      startY: 25,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
    });

    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button
          onClick={printOrders}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Printer className="w-4 h-4" />
          <span>Print Orders</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
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
                  <td className="px-6 py-4">IN{order.number}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full cursor-pointer 
                        ${
                          order.status === "Paid"
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
                        }
                        ${
                          order.status === "Processing"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                        ${
                          order.status === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : ""
                        }
                        ${
                          order.status === "Delivered"
                            ? "bg-gray-100 text-gray-800"
                            : ""
                        }`}
                      onClick={() => handleStatusClick(order)}
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

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full"
          >
            <h2 className="text-xl font-bold mb-4">
              Order Number: {selectedOrder.number}
            </h2>
            <OrderItemTable items={orderItems} />
            <button
              onClick={handleClose}
              className="px-4 py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isStatusModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full"
          >
            <h2 className="text-xl font-bold mb-4">Update Order Status</h2>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="status"
              >
                Status
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="Paid">Paid</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="courier"
              >
                Courier Service
              </label>
              <select
                id="courier"
                value={selectedCourier}
                onChange={(e) => {
                  setSelectedCourier(e.target.value);
                  const selectedCourier = couriers.find(courier => courier.name === e.target.value);
                  setTrackingLink(selectedCourier ? selectedCourier.tracking_link : "");
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Select Courier</option>
                {couriers.map((courier) => (
                  <option key={courier.id} value={courier.name}>
                    {courier.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="trackingNumber"
              >
                Tracking Number
              </label>
              <input
                type="text"
                id="trackingNumber"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="trackingLink"
              >
                Tracking Link
              </label>
              <input
                type="text"
                id="trackingLink"
                value={trackingLink}
                onChange={(e) => setTrackingLink(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button
              onClick={handleStatusUpdate}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Update
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 ml-4 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default OrdersList;
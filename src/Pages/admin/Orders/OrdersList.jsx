import React, { useState } from "react";
import { Printer } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const OrdersList = () => {
  const [orders] = useState([
    { id: 101, customer: "John Doe", status: "Pending", total: "5000", date: "2024-02-05" },
    { id: 102, customer: "Jane Smith", status: "Completed", total: "8000", date: "2024-02-04" },
    { id: 103, customer: "Mark Johnson", status: "Canceled", total: "12000", date: "2024-02-03" },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to handle "View" button click
  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Function to close modal
  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Function to print orders list as a PDF
  const printOrders = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Orders Report", 14, 15);

    const tableColumn = ["Order ID", "Customer", "Status", "Total (Rs.)", "Date"];
    const tableRows = orders.map((order) => [
      order.id,
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total (Rs.)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4">{order.customer}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                    ${order.status === "Pending" ? "bg-yellow-100 text-yellow-800" : ""}
                    ${order.status === "Completed" ? "bg-green-100 text-green-800" : ""}
                    ${order.status === "Canceled" ? "bg-red-100 text-red-800" : ""}`}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            
            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Total:</strong> Rs. {selectedOrder.total}</p>
            <p><strong>Date:</strong> {selectedOrder.date}</p>

            <div className="flex justify-end mt-4">
              <button onClick={handleClose} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;

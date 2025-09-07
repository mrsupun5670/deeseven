import React, { useState, useEffect, useRef } from "react";
import { 
  Printer, 
  ShoppingBag, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Eye, 
  Edit,
  Search,
  Filter,
  Calendar,
  DollarSign,
  User,
  Hash
} from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import OrderItemTable from "../../../Components/OrderItemTable";
import { ToastContainer, toast } from "react-toastify";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
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
              localStorage.removeItem("userRole");
              localStorage.removeItem("admin");
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
      headStyles: { fillColor: [254, 183, 1], textColor: 255 },
    });

    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.number.toString().includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || 
      order.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalOrders = orders.length;
  const paidOrders = orders.filter(o => o.status === "Paid").length;
  const processingOrders = orders.filter(o => o.status === "Processing").length;
  const shippedOrders = orders.filter(o => o.status === "Shipped").length;
  const deliveredOrders = orders.filter(o => o.status === "Delivered").length;

  const getStatusIcon = (status) => {
    switch (status) {
      case "Paid": return <Clock size={16} className="text-yellow-600" />;
      case "Processing": return <Package size={16} className="text-blue-600" />;
      case "Shipped": return <Truck size={16} className="text-purple-600" />;
      case "Delivered": return <CheckCircle size={16} className="text-green-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Processing": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Shipped": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "Delivered": return "bg-green-100 text-green-800 hover:bg-green-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600 mt-1">Track and manage customer orders</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button
              onClick={printOrders}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              <Printer size={16} className="mr-2" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <ShoppingBag size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Paid</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{paidOrders}</h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Processing</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{processingOrders}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Shipped</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{shippedOrders}</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Truck size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Delivered</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{deliveredOrders}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by customer name or order number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Orders List ({filteredOrders.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                            <Hash size={16} className="text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">IN{order.number}</p>
                            <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User size={16} className="text-gray-400 mr-2" />
                          <span className="text-gray-900">{order.customer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusClick(order)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-2">{order.status}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <DollarSign size={16} className="text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">Rs. {order.total}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar size={16} className="text-gray-400 mr-2" />
                          <span className="text-gray-900">{order.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleView(order)}
                            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Eye size={14} className="mr-2" />
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">No orders found</p>
                      <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <ShoppingBag size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <p className="text-gray-500">Order Number: IN{selectedOrder.number}</p>
              </div>
            </div>
            
            <OrderItemTable items={orderItems} />
            
            <div className="flex justify-end mt-6">
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {isStatusModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full mx-4"
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <Edit size={24} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Update Order Status</h2>
                <p className="text-gray-500">Order: IN{selectedOrder.number}</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="Paid">Paid</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Courier Service
                </label>
                <select
                  value={selectedCourier}
                  onChange={(e) => {
                    setSelectedCourier(e.target.value);
                    const selectedCourierObj = couriers.find(courier => courier.name === e.target.value);
                    setTrackingLink(selectedCourierObj ? selectedCourierObj.tracking_link : "");
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select Courier Service</option>
                  {couriers.map((courier) => (
                    <option key={courier.id} value={courier.name}>
                      {courier.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracking Link
                </label>
                <input
                  type="text"
                  value={trackingLink}
                  onChange={(e) => setTrackingLink(e.target.value)}
                  placeholder="Enter tracking URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleStatusUpdate}
                className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Update Order
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer />
    </div>
  );
};

export default OrdersList;
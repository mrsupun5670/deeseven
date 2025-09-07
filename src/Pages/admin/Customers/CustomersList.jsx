import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Download, Plus, Users, Eye, MapPin, Calendar, Mail, Phone, MoreVertical, Search, Filter } from "lucide-react";

const APIURL = import.meta.env.VITE_API_URL;

const Button = ({ onClick, children, className }) => (
  <button onClick={onClick} className={className}>
    {children}
  </button>
);

const AddressModal = ({ isOpen, customer, onClose }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div ref={modalRef} className="bg-white p-8 rounded-xl shadow-2xl w-96 max-w-md mx-4">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-yellow-100 rounded-full mr-4">
            <MapPin size={24} className="text-yellow-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{customer.fname} {customer.lname}</h2>
            <p className="text-gray-500">Customer Address</p>
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700 font-medium">{customer.line1}</p>
            <p className="text-gray-700">{customer.line2}</p>
            <p className="text-gray-700">{customer.city}</p>
            <p className="text-gray-700">{customer.district}</p>
            <p className="text-gray-600 text-sm">Postal Code: {customer.postal_code}</p>
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={onClose} 
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 max-w-md mx-4">
        <div className="text-center mb-6">
          <div className="p-3 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MoreVertical size={24} className="text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Confirm Action</h2>
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={onConfirm} 
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Yes, Continue
          </Button>
          <Button 
            onClick={onCancel} 
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

const CustomersList = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [customerToToggle, setCustomerToToggle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${APIURL}/GetAllCustomersListController.php`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.response) {
            setCustomers(data.customers);
          } else {
            alert(data.message);
            if (data.message === "Unauthorized") {
              sessionStorage.clear();
              window.location.href = "/";
            }
          }
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
        alert("Failed to load customers. Please try again later.");
      }
    };

    fetchCustomers();
  }, []);

  const openModal = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const openConfirmationModal = (customer, action) => {
    if (action === "toggle") {
      setCustomerToToggle(customer);
    }
    setIsConfirmationOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationOpen(false);
    setCustomerToToggle(null);
  };

  const toggleStatus = async (customer) => {
    try {
      const newStatus = customer.status === "Active" ? "Inactive" : "Active";
      const response = await fetch(`${APIURL}/ToggleCustomerStatusController.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ id: customer.id, status: newStatus === "Active" ? 1 : 0 }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response) {
          setCustomers((prevCustomers) =>
            prevCustomers.map((c) => (c.id === customer.id ? { ...c, status: newStatus } : c))
          );
        } else {
          alert(data.message);
        }
      }
    } catch (error) {
      console.error("Error updating customer status:", error);
      alert("Failed to update customer status. Please try again later.");
    } finally {
      closeConfirmationModal();
    }
  };

  const printPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Customers Report", 14, 15);

    const tableColumn = ["Customer ID", "Name", "Mobile", "Email", "Address", "Reg Date", "Status"];
    const tableRows = customers.map((customer) => [
      customer.id,
      `${customer.fname} ${customer.lname}`,
      customer.mobile,
      customer.email,
      `${customer.line1}, ${customer.line2}, ${customer.city}, ${customer.district}, ${customer.postal_code}`,
      customer.date,
      customer.status,
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

  // Filter customers based on search and status
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || 
      customer.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const activeCustomers = customers.filter(c => c.status === "Active").length;
  const inactiveCustomers = customers.filter(c => c.status === "Inactive").length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-gray-600 mt-1">Manage your customer database</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button
              onClick={printPDF}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              <Download size={16} className="mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Customers</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{customers.length}</h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Users size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Customers</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{activeCustomers}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Inactive Customers</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{inactiveCustomers}</h3>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Users size={24} className="text-red-600" />
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
                  placeholder="Search customers by name or email..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Customers List ({filteredCustomers.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-yellow-600 font-medium text-sm">
                            {customer.fname.charAt(0)}{customer.lname.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.fname} {customer.lname}
                          </p>
                          <p className="text-sm text-gray-500">ID: {customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail size={14} className="mr-2 text-gray-400" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone size={14} className="mr-2 text-gray-400" />
                          {customer.mobile}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar size={14} className="mr-2 text-gray-400" />
                        {customer.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openConfirmationModal(customer, "toggle")}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          customer.status === "Active"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {customer.status}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <Button
                          onClick={() => openModal(customer)}
                          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye size={14} className="mr-2" />
                          View Address
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCustomers.length === 0 && (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No customers found</p>
                <p className="text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddressModal isOpen={isModalOpen} customer={selectedCustomer} onClose={closeModal} />
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onConfirm={() => toggleStatus(customerToToggle)}
        onCancel={closeConfirmationModal}
        message="Are you sure you want to change the customer's status?"
      />
    </div>
  );
};

export default CustomersList;
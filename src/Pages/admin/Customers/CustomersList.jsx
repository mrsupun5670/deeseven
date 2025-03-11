import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Download, Plus } from "lucide-react";

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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold">{customer.fname} {customer.lname}'s Address</h2>
        <p className="mt-2 text-gray-700">{customer.line1},</p>
        <p className="mt-2 text-gray-700">{customer.line2},</p>
        <p className="mt-2 text-gray-700">{customer.city}</p>
        <p className="mt-2 text-gray-700">{customer.district}</p>
        <p className="mt-2 text-gray-700">{customer.postal_code}</p>

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold">Confirm Action</h2>
        <p className="mt-2 text-gray-700">{message}</p>
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={onConfirm} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Yes
          </Button>
          <Button onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            No
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
    doc.text("Customers", 14, 15);

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
    });

    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button
          onClick={printPDF}
          className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <Download size={16} />
          <span>Print</span>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow min-w-max">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reg Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white shadow">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4">{customer.id}</td>
                <td className="px-6 py-4">{`${customer.fname} ${customer.lname}`}</td>
                <td className="px-6 py-4">{customer.mobile}</td>
                <td className="px-6 py-4">{customer.email}</td>
                <td className="px-6 py-4">{customer.date}</td>
                <td className="px-6 py-4 cursor-pointer" onClick={() => openConfirmationModal(customer, "toggle")}>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2 justify-end">
                    <Button
                      onClick={() => openModal(customer)}
                      className="px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      View Address
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddressModal isOpen={isModalOpen} customer={selectedCustomer} onClose={closeModal} />
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onConfirm={() => toggleStatus(customerToToggle)}
        onCancel={closeConfirmationModal}
        message="Are you sure you want to change the status?"
      />
    </div>
  );
};

export default CustomersList;
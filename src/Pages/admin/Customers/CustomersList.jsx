import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

const CustomersList = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const customers = [
    {
      id: 1,
      name: "John Doe",
      mobile: "0712345678",
      email: "johndoe@example.com",
      address: "123, Main Street, Colombo",
    },
    {
      id: 2,
      name: "Jane Smith",
      mobile: "0723456789",
      email: "janesmith@example.com",
      address: "45, Lake Road, Kandy",
    },
    {
      id: 3,
      name: "Michael Brown",
      mobile: "0756789123",
      email: "michaelbrown@example.com",
      address: "78, Galle Road, Matara",
    },
    {
      id: 4,
      name: "Emily Johnson",
      mobile: "0767891234",
      email: "emilyjohnson@example.com",
      address: "12, Park Avenue, Jaffna",
    },
    // Add more customers...
  ];

  // Function to open the modal with selected customer's address
  const openModal = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <button
          onClick={() => navigate("/admin/customers/add")}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow min-w-max">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white shadow">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4">{customer.id}</td>
                <td className="px-6 py-4">{customer.name}</td>
                <td className="px-6 py-4">{customer.mobile}</td>
                <td className="px-6 py-4">{customer.email}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={() => openModal(customer)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Address
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Address Modal */}
      {isModalOpen && selectedCustomer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-semibold">Customer Address</h2>
            <p className="mt-2 text-gray-700">{selectedCustomer.address}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersList;

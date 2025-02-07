import React, { useState } from "react";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Download, Plus } from "lucide-react";

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

  // Function to generate and download PDF
  const printPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Customers", 14, 15);

    const tableColumn = ["Customer ID", "Name", "Mobile", "Email", "Address"];
    const tableRows = customers.map((customer) => [
      customer.id,
      customer.name,
      customer.mobile,
      customer.email,
      customer.address,
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
        <button
          onClick={printPDF}
          className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center space-x-2"
        >
          <Download size={16} />
          <span>Print</span>
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
                      className="px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      View Address
                    </button>
                    <button className="px-3 py-1 text-white bg-red-600 rounded-lg hover:bg-red-700">
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

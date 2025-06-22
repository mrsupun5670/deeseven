import React, { useState } from 'react';

const TransactionHistory = () => {
  // Sample transaction data - replace with your actual data
  const transactions = [
    {
      id: "TXN001",
      orderId: "ORD123",
      amount: 1500.00,
      type: "payment",
      date: "2025-02-08",
      time: "14:30:00",
      customer: {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890"
      },
      paymentMethod: "Credit Card",
      status: "completed"
    },
    {
      id: "TXN002",
      orderId: "ORD124",
      amount: -500.00,
      type: "refund",
      date: "2025-02-08",
      time: "15:45:00",
      customer: {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+1234567891"
      },
      paymentMethod: "Credit Card",
      status: "completed"
    }
  ];

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const formatLKR = (value) => {
    return `Rs. ${new Intl.NumberFormat('si-LK').format(value)}`;
  };

  const formatDateTime = (date, time) => {
    return new Date(`${date}T${time}`).toLocaleString();
  };

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  return (
    <div className="p-6  mx-auto">
      <h1 className="text-2xl font-bold mb-6">Transaction History</h1>
      
      {/* Main Transaction Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{transaction.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.orderId}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatLKR(transaction.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateTime(transaction.date, transaction.time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleViewDetails(transaction)}
                    className="text-blue-600 hover:text-blue-900 font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Transaction Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-500 mb-3">Transaction Info</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Transaction ID:</span> {selectedTransaction.id}</p>
                  <p><span className="font-medium">Order ID:</span> {selectedTransaction.orderId}</p>
                  <p><span className="font-medium">Amount:</span> {formatLKR(selectedTransaction.amount)}</p>
                  <p><span className="font-medium">Type:</span> {selectedTransaction.type}</p>
                  <p><span className="font-medium">Date & Time:</span> {formatDateTime(selectedTransaction.date, selectedTransaction.time)}</p>
                  <p><span className="font-medium">Payment Method:</span> {selectedTransaction.paymentMethod}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-500 mb-3">Customer Info</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedTransaction.customer.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedTransaction.customer.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedTransaction.customer.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
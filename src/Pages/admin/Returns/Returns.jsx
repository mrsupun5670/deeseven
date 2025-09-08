import React, { useState, useEffect } from 'react';
import { 
  Package, 
  MessageCircle, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Truck, 
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Edit,
  Phone
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

const Returns = () => {
  const APIURL = import.meta.env.VITE_API_URL;
  
  const [returns, setReturns] = useState([]);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Add new return form state
  const [newReturn, setNewReturn] = useState({
    orderNumber: '',
    whatsappNumber: '',
    returnReason: '',
  });

  const returnStatuses = {
    1: { name: 'Requested', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    2: { name: 'Under Review', color: 'bg-blue-100 text-blue-800', icon: Eye },
    3: { name: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    4: { name: 'Replacement Sent', color: 'bg-purple-100 text-purple-800', icon: Truck },
    5: { name: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    6: { name: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const response = await fetch(`${APIURL}/GetAllReturnsController.php`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response) {
          setReturns(data.returns);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error('Error fetching returns:', error);
      toast.error('Failed to load returns');
    }
  };

  const handleAddReturn = async () => {
    if (!newReturn.orderNumber || !newReturn.whatsappNumber || !newReturn.returnReason) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${APIURL}/AddReturnController.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          orderNumber: newReturn.orderNumber,
          whatsappNumber: newReturn.whatsappNumber,
          returnReason: newReturn.returnReason,
          items: [] // Empty for now since manual entry doesn't require specific items
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response) {
          toast.success('Return added successfully');
          setIsAddModalOpen(false);
          setNewReturn({
            orderNumber: '',
            whatsappNumber: '',
            returnReason: '',
          });
          fetchReturns(); // Refresh the list
        } else {
          toast.error(data.message);
        }
      } else {
        toast.error('Failed to add return');
      }
    } catch (error) {
      console.error('Error adding return:', error);
      toast.error('Failed to add return');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (returnItem) => {
    setSelectedReturn(returnItem);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = async (returnId, newStatus, notes = '', trackingNumber = '') => {
    try {
      const response = await fetch(`${APIURL}/UpdateReturnStatusController.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          returnId,
          status: newStatus,
          adminNotes: notes,
          trackingNumber
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response) {
          toast.success('Return status updated successfully');
          fetchReturns();
          setIsModalOpen(false);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error('Error updating return status:', error);
      toast.error('Failed to update return status');
    }
  };

  const openWhatsApp = (phoneNumber, returnId, orderNumber) => {
    const message = `Hello! Regarding your return request #${returnId} for order #${orderNumber}. How can we assist you?`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredReturns = returns.filter(returnItem => {
    const matchesSearch = 
      returnItem.order_number.toString().includes(searchTerm) ||
      returnItem.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnItem.return_id.toString().includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || 
      returnItem.return_status.toString() === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: returns.length,
    requested: returns.filter(r => r.return_status === 1).length,
    underReview: returns.filter(r => r.return_status === 2).length,
    approved: returns.filter(r => r.return_status === 3).length,
    completed: returns.filter(r => r.return_status === 5).length
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Returns Management</h1>
            <p className="text-gray-600 mt-1">Track and manage product returns for defective/damaged items</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-lg"
            >
              <Plus size={16} className="mr-2" />
              Add Return
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Returns</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.total}</h3>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Package size={24} className="text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Requested</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.requested}</h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Under Review</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.underReview}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Eye size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Approved</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.approved}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.completed}</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <CheckCircle size={24} className="text-purple-600" />
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
                  placeholder="Search by return ID, order number, or customer name..."
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
                <option value="1">Requested</option>
                <option value="2">Under Review</option>
                <option value="3">Approved</option>
                <option value="4">Replacement Sent</option>
                <option value="5">Completed</option>
                <option value="6">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Returns Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Returns List ({filteredReturns.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Return Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                {filteredReturns.length > 0 ? (
                  filteredReturns.map((returnItem) => {
                    const status = returnStatuses[returnItem.return_status];
                    const StatusIcon = status.icon;
                    
                    return (
                      <tr key={returnItem.return_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                              <AlertTriangle size={16} className="text-red-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Return #{returnItem.return_id}</p>
                              <p className="text-sm text-gray-500">Defective/Damaged</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{returnItem.customer_name}</p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Phone size={14} className="mr-1" />
                              {returnItem.whatsapp_number}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">Order #{returnItem.order_number}</p>
                            <p className="text-sm text-gray-500">{returnItem.items_count} item(s)</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            <StatusIcon size={14} className="mr-1" />
                            {status.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {new Date(returnItem.return_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => openWhatsApp(returnItem.whatsapp_number, returnItem.return_id, returnItem.order_number)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Contact via WhatsApp"
                            >
                              <MessageCircle size={16} />
                            </button>
                            <button
                              onClick={() => handleViewDetails(returnItem)}
                              className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Eye size={14} className="mr-2" />
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <Package size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">No returns found</p>
                      <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Return Details Modal */}
      {isModalOpen && selectedReturn && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full mr-4">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Return Details</h2>
                  <p className="text-gray-500">Return #{selectedReturn.return_id}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Return Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Return ID:</span> #{selectedReturn.return_id}</p>
                  <p><span className="font-medium">Order Number:</span> #{selectedReturn.order_number}</p>
                  <p><span className="font-medium">Date:</span> {new Date(selectedReturn.return_date).toLocaleDateString()}</p>
                  <p><span className="font-medium">Reason:</span> {selectedReturn.return_reason}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedReturn.customer_name}</p>
                  <p><span className="font-medium">WhatsApp:</span> {selectedReturn.whatsapp_number}</p>
                  <div className="mt-3">
                    <button
                      onClick={() => openWhatsApp(selectedReturn.whatsapp_number, selectedReturn.return_id, selectedReturn.order_number)}
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <MessageCircle size={16} className="mr-2" />
                      Contact via WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Update Actions */}
            <div className="bg-yellow-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                {selectedReturn.return_status === 1 && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(selectedReturn.return_id, 2)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Mark Under Review
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedReturn.return_id, 6)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject Return
                    </button>
                  </>
                )}
                {selectedReturn.return_status === 2 && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(selectedReturn.return_id, 3)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve Return
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedReturn.return_id, 6)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reject Return
                    </button>
                  </>
                )}
                {selectedReturn.return_status === 3 && (
                  <button
                    onClick={() => handleStatusUpdate(selectedReturn.return_id, 4)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Mark Replacement Sent
                  </button>
                )}
                {selectedReturn.return_status === 4 && (
                  <button
                    onClick={() => handleStatusUpdate(selectedReturn.return_id, 5)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Return Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full mr-4">
                  <Plus size={24} className="text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add New Return</h2>
                  <p className="text-gray-500">Create a new return request</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number *
                </label>
                <input
                  type="text"
                  value={newReturn.orderNumber}
                  onChange={(e) => setNewReturn(prev => ({ ...prev, orderNumber: e.target.value }))}
                  placeholder="Enter order number (e.g., 1234)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number *
                </label>
                <input
                  type="text"
                  value={newReturn.whatsappNumber}
                  onChange={(e) => setNewReturn(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  placeholder="Enter WhatsApp number (e.g., +94701234567)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Return Reason *
                </label>
                <textarea
                  value={newReturn.returnReason}
                  onChange={(e) => setNewReturn(prev => ({ ...prev, returnReason: e.target.value }))}
                  placeholder="Describe the defect or damage (e.g., Product arrived damaged, stitching issues, color fading, etc.)"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertTriangle size={16} className="text-yellow-600 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">Return Policy</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      We only accept returns for defective or damaged products. No cash refunds - we provide replacement items only.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddReturn}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Adding...' : 'Add Return'}
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
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

export default Returns;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { 
  Download, 
  Plus, 
  Trash2, 
  Pencil, 
  Package, 
  Search, 
  Filter,
  DollarSign,
  Hash,
  Tag,
  Layers,
  Eye,
  AlertTriangle
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

const APIURL = import.meta.env.VITE_API_URL;

const Button = ({ onClick, children, className }) => (
  <button onClick={onClick} className={className}>
    {children}
  </button>
);

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96 max-w-md mx-4">
        <div className="text-center mb-6">
          <div className="p-3 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <AlertTriangle size={24} className="text-yellow-600" />
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

const ProductsList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [productToToggle, setProductToToggle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${APIURL}/GetAllProductsListController.php`,
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
          if (data.response) {
            setProducts(data.products);
          } else {
            alert(data.message);
            if (data.message === "Unauthorized") {
              sessionStorage.clear();
              window.location.href = "/";
            }
          }
        }
      } catch (error) {
        toast.error("Failed to load products. Please try again later.");
      }
    };

    fetchProducts();
  }, []);

  const openConfirmationModal = (product) => {
    setProductToToggle(product);
    setIsConfirmationOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationOpen(false);
    setProductToToggle(null);
  };

  const toggleStatus = async () => {
    try {
      const newStatus =
        productToToggle.status === "Active" ? "Inactive" : "Active";

      const response = await fetch(
        `${APIURL}/ToggleProductStatusController.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            productId: productToToggle.id,
            status: newStatus === "Active" ? 1 : 0,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.response) {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === productToToggle.id
                ? { ...product, status: newStatus }
                : product
            )
          );
        } else {
          alert(data.message);
        }
      }
    } catch (error) {
      toast.error("Error updating product status");
    } finally {
      closeConfirmationModal();
    }
  };

  const handleEdit = (productId) => {
    navigate(`../edit/${productId}`);
  };

  const printPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Products Report", 14, 15);

    const tableColumn = [
      "Product ID",
      "Name",
      "Category",
      "Price (Rs.)",
      "Available Sizes",
      "Status",
    ];
    const tableRows = products.map((product) => [
      product.id,
      product.title,
      product.category.name,
      product.price,
      product.sizes.map((size) => size.size_name).join(", "),
      product.status,
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

  // Filter products based on search and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm);
    
    const matchesStatus = filterStatus === "all" || 
      product.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const activeProducts = products.filter(p => p.status === "Active").length;
  const inactiveProducts = products.filter(p => p.status === "Inactive").length;
  const outOfStock = products.filter(p => p.sizes.length === 0).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600 mt-1">Manage your product inventory and catalog</p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button
              onClick={() => navigate("../add")}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-lg"
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </Button>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{products.length}</h3>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Package size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Products</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{activeProducts}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Package size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Inactive Products</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{inactiveProducts}</h3>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <Package size={24} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Out of Stock</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{outOfStock}</h3>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle size={24} className="text-orange-600" />
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
                  placeholder="Search products by name, category, or ID..."
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

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Products List ({filteredProducts.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available Sizes
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
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                            <Hash size={16} className="text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 truncate max-w-xs">{product.title}</p>
                            <p className="text-sm text-gray-500">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Tag size={16} className="text-gray-400 mr-2" />
                          <span className="text-gray-900">{product.category.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <DollarSign size={16} className="text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">Rs. {product.price}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Layers size={16} className="text-gray-400 mr-2" />
                          {product.sizes.length > 0 ? (
                            <span className="text-gray-900">
                              {product.sizes.map((size) => size.size_name).join(", ")}
                            </span>
                          ) : (
                            <span className="text-red-500 flex items-center">
                              <AlertTriangle size={14} className="mr-1" />
                              Out of Stock
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openConfirmationModal(product)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            product.status === "Active"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {product.status}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <Button
                            onClick={() => handleEdit(product.id)}
                            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Pencil size={14} className="mr-2" />
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <Package size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">No products found</p>
                      <p className="text-gray-400">Try adjusting your search or filter criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onConfirm={toggleStatus}
        onCancel={closeConfirmationModal}
        message="Are you sure you want to change the product status?"
      />
      <ToastContainer />
    </div>
  );
};

export default ProductsList;
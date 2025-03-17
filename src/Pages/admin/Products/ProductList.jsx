import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { Download, Plus } from "lucide-react";

const APIURL = import.meta.env.VITE_API_URL;

const Button = ({ onClick, children, className }) => (
  <button onClick={onClick} className={className}>
    {children}
  </button>
);

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold">Confirm Action</h2>
        <p className="mt-2 text-gray-700">{message}</p>
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Yes
          </Button>
          <Button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            No
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
        console.error("Error fetching products:", error);
        alert("Failed to load products. Please try again later.");
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
      console.error("Error updating product status:", error);
      alert("Failed to update product status. Please try again later.");
    } finally {
      closeConfirmationModal();
    }
  };

  const printPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Products", 14, 15);

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
      product.category,
      product.price,
      product.sizes.map((size) => size.size_name).join(", "),
      product.status,
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
        <h1 className="text-2xl font-bold">Products</h1>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price (Rs.)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Available Sizes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white shadow">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">{product.id}</td>
                <td className="px-6 py-4">{product.title}</td>
                <td className="px-6 py-4">{product.category.name}</td>
                <td className="px-6 py-4">{product.price}</td>
                <td className="px-6 py-4">
                  {product.sizes.length > 0 ? (
                    product.sizes.map((size) => size.size_name).join(", ")
                  ) : (
                    <span className="text-red-500">Out of Stock</span>
                  )}
                </td>
                <td
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => openConfirmationModal(product)}
                >
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      product.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2 justify-end">
                    <Button
                      onClick={() =>
                        navigate(`/admin/products/edit`, { state: { product } })
                      }
                      className="px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Edit
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onConfirm={toggleStatus}
        onCancel={closeConfirmationModal}
        message="Are you sure you want to change the status?"
      />
    </div>
  );
};

export default ProductsList;
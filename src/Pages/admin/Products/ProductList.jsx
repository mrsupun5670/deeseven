import React from "react";
import { Plus, Printer } from "lucide-react";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ProductsList = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Product A",
      category: "Category X",
      price: "199.99",
      stock: 30,
      color: "Red",
      size: "M",
      status: "In Stock",
    },
    {
      id: 2,
      name: "Product B",
      category: "Category Y",
      price: "149.99",
      stock: 20,
      color: "Blue",
      size: "L",
      status: "In Stock",
    },
    {
      id: 3,
      name: "Product C",
      category: "Category X",
      price: "249.99",
      stock: 15,
      color: "Black",
      size: "XL",
      status: "Out of Stock",
    },
    {
      id: 4,
      name: "Product D",
      category: "Category Z",
      price: "99.99",
      stock: 50,
      color: "Green",
      size: "S",
      status: "In Stock",
    },
  ];

  // Function to print inventory hardcopy
  const printInventory = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Inventory Report", 14, 15);

    const tableColumn = ["Product ID", "Name", "Category", "Price (Rs.)", "Stock", "Color", "Size", "Status"];
    const tableRows = products.map((product) => [
      product.id,
      product.name,
      product.category,
      product.price,
      product.stock,
      product.color,
      product.size,
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
        <div className="flex space-x-2">
          <button
            onClick={printInventory}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Printer className="w-4 h-4" />
            <span>Print Inventory</span>
          </button>
          <button
            onClick={() => navigate("/admin/products/add")}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price (Rs.)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white shadow">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">{product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">{product.color}</td>
                <td className="px-6 py-4">{product.size}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.status === "In Stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={() => navigate("/admin/products/edit")}
                      className="px-3 py-1 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Edit
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
    </div>
  );
};

export default ProductsList;

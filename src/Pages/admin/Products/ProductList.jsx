import React from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

const ProductsList = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Product 1",
      category: "Category A",
      price: "99.99",
      stock: 45,
      status: "In Stock",
    },
    {
      id: 2,
      name: "Product 1",
      category: "Category A",
      price: "99.99",
      stock: 45,
      status: "In Stock",
    },
    {
      id: 3,
      name: "Product 1",
      category: "Category A",
      price: "99.99",
      stock: 45,
      status: "In Stock",
    },
    {
      id: 4,
      name: "Product 1",
      category: "Category A",
      price: "99.99",
      stock: 45,
      status: "In Stock",
    },
    // Add more products...
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => navigate("/admin/products/add")}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-50">
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
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase ">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white shadow">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">{product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2 justify-end">
                    <button
                      onClick={() => navigate("/admin/products/edit")}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
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
    </div>
  );
};

export default ProductsList;

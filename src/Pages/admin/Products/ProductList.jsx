import React, { useEffect, useState } from "react";
import { Plus, Printer } from "lucide-react";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const ProductsList = () => {
    const APIURL = import.meta.env.VITE_API_URL;
  
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${APIURL}/GetAllProductsListController.php`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`,
                    },
                });
  
                if (response.ok) {
                    const data = await response.json();
                    if (data.response === true) {
                        setProducts(data.products);
                    } else {
                        alert(data.message);
                        if (data.message === "Unauthorized") {
                            sessionStorage.removeItem("authToken");
                            sessionStorage.removeItem("userRole");
                            sessionStorage.removeItem("admin");
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

    // Function to print inventory hardcopy
    const printInventory = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Inventory Report", 14, 15);

        const tableColumn = ["Product ID", "Name", "Category", "Price (Rs.)", "Available Sizes", "Status"];
        const tableRows = products.map((product) => [
            product.id,
            product.title,
            product.category,
            product.price,
            product.sizes.map(size => size.size_name).join(", "),
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Available Sizes</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white shadow">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4">{product.title}</td>
                                <td className="px-6 py-4">{product.category}</td>
                                <td className="px-6 py-4">{product.price}</td>
                                <td className="px-6 py-4">
                                    {product.sizes.map(size => size.size_name).join(", ")}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {product.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2 justify-end">
                                        <button
                                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
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
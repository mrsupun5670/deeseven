import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const TopProducts = () => {
  const APIURL = import.meta.env.VITE_API_URL || "";

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
     try {
      const response = await fetch(`${APIURL}/LoadTopSellingProducts.php`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });   
          if (response.ok) {
         const data = await response.json();
         if (data.response) {
           setProducts(data.products);
        } else {
           toast.error(data.message);
        }
      } else {
        toast.error('Failed to fetch top selling products');
      }
     } catch (error) {
       toast.error('Error fetching data');
     }
   };

    fetchData();
  }, []);

  return (
    <div className="w-full p-7 col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-stroke dark:bg-box xl:col-span-4">
      <h2 className="text-xl font-bold mb-4">Top Selling Items</h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Unit Price</th>
              <th className="p-3 text-left">Sold</th>
              <th className="p-3 text-end">Sales</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-3 flex items-center space-x-3">
                  <img
                    src={`${APIURL}/${product.image}`}
                    alt={`${product.title} image`}
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{product.title}</span>
                </td>
                <td className="p-3">Rs.{product.unitPrice.toFixed(2)}</td>
                <td className="p-3">{product.sales}</td>
                <td className="p-3 text-end">Rs.{(product.sales * product.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            <ToastContainer />
    </div>
  );
};

export default TopProducts;
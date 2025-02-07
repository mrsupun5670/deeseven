import React from 'react';
import main1 from "../assets/main1.jpg";


const Product = [
  {
    image: main1,
    title: 'Wireless Headphones',
    unitPrice: 10,
    sales: 1250,
  },
  {
    image: main1,
    title: 'Smart Watch',
    unitPrice: 199.50,
    sales: 980,
  },
  {
    image: main1,
    title: 'Bluetooth Speaker',
    unitPrice: 79.99,
    sales: 750,
  },
  {
    image: main1,
    title: 'Portable Charger',
    unitPrice: 49.99,
    sales: 620,
  },
  {
    image: main1,
    title: 'Noise Cancelling Earbuds',
    unitPrice: 159.99,
    sales: 890,
  }
];

const TopProducts = () => {
  return (
    <div className="w-full p-7 col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h2 className="text-xl font-bold mb-4">Top Selling Items</h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Unit Price</th>
              <th className="p-3 text-left">Sales</th>
              <th className="p-3 text-end">Total</th>

            </tr>
          </thead>
          <tbody>
            {Product.map((product, index) => (
              <tr 
                key={index} 
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-3 flex items-center space-x-3">
                  <img 
                    src={product.image} 
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
    </div>
  );
};

export default TopProducts;
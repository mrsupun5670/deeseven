import React from 'react';

const Product = [
  {
    image: 'https://via.placeholder.com/50',
    title: 'Wireless Headphones',
    unitPrice: 129.99,
    sales: 1250,
  },
  {
    image: 'https://via.placeholder.com/50',
    title: 'Smart Watch',
    unitPrice: 199.50,
    sales: 980,
  },
  {
    image: 'https://via.placeholder.com/50',
    title: 'Bluetooth Speaker',
    unitPrice: 79.99,
    sales: 750,
  },
  {
    image: 'https://via.placeholder.com/50',
    title: 'Portable Charger',
    unitPrice: 49.99,
    sales: 620,
  },
  {
    image: 'https://via.placeholder.com/50',
    title: 'Noise Cancelling Earbuds',
    unitPrice: 159.99,
    sales: 890,
  }
];

const TopProducts = () => {
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Top Selling Items</h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Unit Price</th>
              <th className="p-3 text-left">Sales</th>
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
                <td className="p-3">${product.unitPrice.toFixed(2)}</td>
                <td className="p-3">{product.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProducts;
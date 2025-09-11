import React from "react";
import { Package, ShoppingBag } from "lucide-react";

export default function OrderItemTable({ orderItems }) {

  if (!orderItems || orderItems.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <Package size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">No order orderItems found</p>
        <p className="text-gray-400">This order appears to be empty</p>
      </div>
    );
  }

  // Calculate total order amount
  const totalAmount = orderItems.reduce((sum, item) => {
    const qty = parseInt(item.order_item_qty) || 0;
    const price = parseFloat(item.product_price) || 0;
    return sum + (qty * price);
  }, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex orderItems-center justify-between">
          <div className="flex orderItems-center">
            <ShoppingBag size={20} className="text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Order orderItems</h3>
          </div>
          <span className="text-sm text-gray-500">{orderItems.length} item{orderItems.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orderItems.map((item, index) => {
              const qty = parseInt(item.order_item_qty) || 0;
              const price = parseFloat(item.product_price) || 0;
              const itemTotal = qty * price;
              
              return (
                <tr key={item.order_item_id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.title || item.product_title || 'Unknown Product'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Product ID: {item.product_id}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex orderItems-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.order_item_size || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    {qty}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    Rs. {price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    Rs. {itemTotal.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td colSpan="4" className="px-6 py-4 text-right font-medium text-gray-900">
                Total Order Amount:
              </td>
              <td className="px-6 py-4 font-bold text-lg text-gray-900">
                Rs. {totalAmount.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
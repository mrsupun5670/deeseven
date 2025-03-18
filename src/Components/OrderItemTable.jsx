import React from "react";

export default function OrderItemTable({orderItems}) {

  console.log(orderItems);
  
  return (
    <div>
      <table className="w-full rounded-lg shadow">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Unit Price (Rs.)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Total (Rs.)
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {orderItems.length > 0 ? (
            orderItems.map((orderItem, index) => (
              <tr key={index}>
                <td className="px-6 py-4">
                  {orderItem.title}
                </td>
                <td className="px-6 py-4">{orderItem.order_item_qty}</td>
                <td className="px-6 py-4">{orderItem.product_price}</td>
                <td className="px-6 py-4">
                  {orderItem.order_item_qty * orderItem.product_price}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-2">
                No order items found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
import React from "react";

export default function OrderItemTable({ orderItems }) {

  const validOrderItems = Array.isArray(orderItems) ? orderItems : [];

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
          {validOrderItems.length > 0 ? (
            validOrderItems.map((orderItem) => (
              <tr key={orderItem.order_item_id}>
                <td className="px-6 py-4">
                  {orderItem.product_title} - {orderItem.size}
                </td>
                <td className="px-6 py-4">{orderItem.qty}</td>
                <td className="px-6 py-4">{orderItem.product_price}</td>
                <td className="px-6 py-4">
                  {orderItem.qty * orderItem.product_price}
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

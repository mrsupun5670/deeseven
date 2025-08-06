import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function SalesTrend() {
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    const loadTrend = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/LoadSalesData.php`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
          }
        });
        const data = await res.json();
        if (data.response) {
          setTrendData(data.category_trend || []);
        }
      } catch (err) {
        console.error("Error loading sales trend:", err);
      }
    };

    loadTrend();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Weekly Sales Trend by Category</h2>
      <div className="h-80">
        <ResponsiveContainer>
          <LineChart data={trendData} margin={{ top: 20, right: 30, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value) => `Rs. ${value}`} />
            <Legend />
            <Line type="monotone" dataKey="Men" stroke="#FFB700" strokeWidth={2} />
            <Line type="monotone" dataKey="Women" stroke="#34D399" strokeWidth={2} />
            <Line type="monotone" dataKey="Kids" stroke="#60A5FA" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

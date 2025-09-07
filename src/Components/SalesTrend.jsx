import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from "recharts";

const sampleTrendData = [
  { day: "Mon", Men: 4000, Women: 2400, Kids: 1400 },
  { day: "Tue", Men: 3000, Women: 1398, Kids: 2210 },
  { day: "Wed", Men: 2000, Women: 9800, Kids: 2290 },
  { day: "Thu", Men: 2780, Women: 3908, Kids: 2000 },
  { day: "Fri", Men: 1890, Women: 4800, Kids: 2181 },
  { day: "Sat", Men: 2390, Women: 3800, Kids: 2500 },
  { day: "Sun", Men: 3490, Women: 4300, Kids: 2100 },
];

const requestSalesTrendData = async () => {
  const APIURL = import.meta.env.VITE_API_URL || "";
  try {
    const response = await fetch(`${APIURL}/LoadSalesTrend.php`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data.response === true) {
        return data.trend_data || [];
      } else {
        console.error("Failed to fetch sales trend data:", data.message);
        return [];
      }
    } else {
      console.error("Failed to fetch sales trend data:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error fetching sales trend data:", error);
    return [];
  }
};

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

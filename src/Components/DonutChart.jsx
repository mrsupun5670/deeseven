import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#FFB700", "#34D399", "#60A5FA", "#F87171", "#A78BFA"];

export default function DonutChart() {
  const [categoryData, setCategoryData] = useState([]);
  const APIURL = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${APIURL}/LoadSalesData.php`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`
          }
        });
        const data = await res.json();
        if (data.response) {
          setCategoryData(data.weekly_category_sales || []);
        }
      } catch (error) {
        console.error("Failed to fetch donut chart data:", error);
      }
    };

    fetchData();
  }, [APIURL]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Sales by Category (Last 7 Days)</h2>
      <div className="h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `Rs. ${value}`} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

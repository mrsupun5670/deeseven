import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#FFB700", "#34D399", "#60A5FA", "#F87171", "#A78BFA"];

const sampleData = [
  { name: "Men's Wear", value: 45000 },
  { name: "Women's Wear", value: 63200 },
  { name: "Kids", value: 18300 },
  { name: "Accessories", value: 9600 },
];

export default function DonutChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Sales by Category</h2>
      <div className="h-72">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={sampleData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {sampleData.map((entry, index) => (
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

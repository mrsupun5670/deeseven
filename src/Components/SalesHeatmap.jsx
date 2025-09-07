import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays } from "date-fns";

const today = new Date();
const startDate = subDays(today, 150);

// Example mock data: [{ date: "2024-12-01", count: 3 }, ...]
const generateSampleData = () => {
  const data = [];
  for (let i = 0; i < 150; i++) {
    const date = subDays(today, i).toISOString().split("T")[0];
    const count = Math.floor(Math.random() * 5); // up to 4 sales/day
    data.push({ date, count });
  }
  return data;
};

export default function SalesHeatmap() {
  const salesData = generateSampleData();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Sales Activity Calendar</h2>
      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={salesData}
        classForValue={(value) => {
          if (!value || value.count === 0) return "color-empty";
          if (value.count <= 1) return "color-scale-1";
          if (value.count <= 2) return "color-scale-2";
          if (value.count <= 3) return "color-scale-3";
          return "color-scale-4";
        }}
        tooltipDataAttrs={(value) => {
          return {
            "data-tip": `${value.date}: ${value.count || 0} sales`,
          };
        }}
        showWeekdayLabels={true}
      />
    </div>
  );
}

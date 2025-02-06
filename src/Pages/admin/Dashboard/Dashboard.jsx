import React from "react";
import { Users, Package, DollarSign, BarChart2 } from "lucide-react";
import AnimatedContent from "../../../Components/AnimatedContent";
import LineChart from "../../../Components/LineChart";
import BarChart from "../../../Components/BarChart";
import TopProducts from "../../../Components/TopProducts";

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div>
    <AnimatedContent
      distance={150}
      direction="vertical"
      reverse={false}
      config={{ tension: 50, friction: 25 }}
      initialOpacity={0.2}
      animateOpacity
      scale={1.1}
      threshold={0.2}
    >
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <Icon className="w-12 h-12 text-amber-500" />
        </div>
      </div>
    </AnimatedContent>
  </div>
);

export default function Dashboard() {
  const stats = [
    { title: "Today Sold", value: "28", icon: BarChart2, trend: 12 },
    { title: "Today Sales", value: "Rs.125030.00", icon: DollarSign, trend: -2 },
    { title: "Total Products", value: "2800", icon: Package, trend: 5 },
    { title: "Active Customers", value: "120000", icon: Users, trend: 8 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      <div className="flex flex-col lg:flex-row w-full gap-4">
        <div className="w-full lg:w-2/3">
          <AnimatedContent
            distance={150}
            direction="vertical"
            reverse={false}
            config={{ tension: 50, friction: 25 }}
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
          >
            <LineChart />
          </AnimatedContent>
        </div>
        <div className="w-full lg:w-1/3">
          <AnimatedContent
            distance={150}
            direction="vertical"
            reverse={false}
            config={{ tension: 50, friction: 25 }}
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
          >
            <BarChart />
          </AnimatedContent>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row w-full gap-4">
        <div className="w-full ">
          <AnimatedContent
            distance={150}
            direction="vertical"
            reverse={false}
            config={{ tension: 50, friction: 25 }}
            initialOpacity={0.2}
            animateOpacity
            scale={1.1}
            threshold={0.2}
          >
            <TopProducts />
          </AnimatedContent>
        </div>
        
      </div>
    </div>
  );
}

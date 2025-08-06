import React, { useEffect, useState } from "react";
import {
  BarChart2,
  TrendingUp,
  CalendarDays,
  DollarSign,
  DownloadCloud,
} from "lucide-react";
import AnimatedContent from "../../../Components/AnimatedContent";
import { toast, ToastContainer } from "react-toastify";
import BarChart from "../../../Components/BarChart";
import DonutChart from "../../../Components/DonutChart"; // custom component for category breakdown
import TopProducts from "../../../Components/TopProducts";
import SalesTrend from "../../../Components/SalesTrend"; // multi-line trend chart
import SalesHeatmap from "../../../Components/SalesHeatmap"; // optional heatmap calendar

const StatCard = ({ title, value, icon: Icon, color = "text-amber-500" }) => (
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
        <Icon className={`w-12 h-12 ${color}`} />
      </div>
    </div>
  </AnimatedContent>
);

export default function SalesOverview() {
  const APIURL = import.meta.env.VITE_API_URL || "";

  const [overviewData, setOverviewData] = useState({
    totalSales: "0.00",
    averageOrderValue: "0.00",
    totalOrders: 0,
    salesGrowth: "0%",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSalesOverview = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${APIURL}/LoadSalesData.php`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.response === true) {
            setOverviewData({
              totalSales: data.total_sales || "0.00",
              averageOrderValue: data.avg_order_value || "0.00",
              totalOrders: data.total_orders || 0,
              salesGrowth: data.sales_growth || "0%",
            });
          } else {
            toast.error(data.message);
          }
        }
      } catch (error) {
        toast.error("Failed to load sales overview");
      } finally {
        setIsLoading(false);
      }
    };

    loadSalesOverview();
  }, [APIURL]);

  const cards = [
    { title: "Total Sales", value: `Rs. ${overviewData.totalSales}`, icon: DollarSign },
    { title: "Total Orders", value: overviewData.totalOrders, icon: BarChart2 },
    { title: "Avg. Order Value", value: `Rs. ${overviewData.averageOrderValue}`, icon: CalendarDays },
    { title: "Sales Growth", value: overviewData.salesGrowth, icon: TrendingUp, color: "text-green-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sales Overview</h1>
       
      </div>

      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <div className="space-y-4 text-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
            <p className="text-muted-foreground animate-pulse">Loading data...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2">
              <AnimatedContent>
                <SalesTrend />
              </AnimatedContent>
            </div>
            <div className="col-span-1">
              <AnimatedContent>
                <DonutChart />
              </AnimatedContent>
            </div>
          </div>

          <AnimatedContent>
            <TopProducts />
          </AnimatedContent>

       
        </>
      )}

      <ToastContainer />
    </div>
  );
}

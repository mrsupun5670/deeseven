import { useState } from "react";
// import DashboardHeader from "../components/DashboardHeader";
// import SummaryCards from "../components/SummaryCards";
// import SalesChart from "../components/SalesChart";
// import TopProducts from "../components/TopProducts";
// import CategoryBreakdown from "../components/CategoryBreakdown";
// import RecentOrders from "../components/RecentOrders";
// import { fetchSalesData, TimePeriod } from "../services/salesData";

const SalesOverview = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  
  // In a real app, this would use React Query or similar
  const salesData = fetchSalesData(timePeriod);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader 
          title="Sales Overview" 
          timePeriod={timePeriod} 
          onTimePeriodChange={setTimePeriod} 
        />
        
        <SummaryCards data={salesData.summary} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <SalesChart data={salesData.dailySales} period={timePeriod} />
          </div>
          <div>
            <CategoryBreakdown data={salesData.categories} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <RecentOrders orders={salesData.recentOrders} />
          </div>
          <div>
            <TopProducts products={salesData.topProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;

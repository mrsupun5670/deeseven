import React, { useEffect, useState } from "react";
import { 
  Users, 
  Package, 
  DollarSign, 
  BarChart2, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Calendar,
  RefreshCw,
  Eye
} from "lucide-react";
import AnimatedContent from "../../../Components/AnimatedContent";
import LineChart from "../../../Components/LineChart";
import BarChart from "../../../Components/BarChart";
import TopProducts from "../../../Components/TopProducts";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";

const COLORS = {
  primary: '#feb701',
  secondary: '#f59e0b',
  success: '#10b981',
  danger: '#ef4444',
  info: '#3b82f6',
  gray: '#6b7280',
  light: '#f9fafb'
};

const StatCard = ({ title, value, icon: Icon, trend, color = COLORS.primary }) => (
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
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 transform transition-all hover:scale-105" style={{borderLeftColor: color}}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            {trend !== undefined && (
              <div className={`flex items-center mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span className="ml-1 text-sm font-medium">{Math.abs(trend)}%</span>
                <span className="ml-1 text-xs text-gray-500">vs yesterday</span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-full" style={{backgroundColor: `${color}20`}}>
            <Icon size={24} style={{color: color}} />
          </div>
        </div>
      </div>
    </AnimatedContent>
  </div>
);

const QuickActionCard = ({ title, description, icon: Icon, onClick, color = COLORS.primary }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl" onClick={onClick}>
    <div className="flex items-center">
      <div className="p-3 rounded-full mr-4" style={{backgroundColor: `${color}20`}}>
        <Icon size={24} style={{color: color}} />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const APIURL = import.meta.env.VITE_API_URL || "";
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [todaySales, setTodaySales] = useState("0.00");
  const [activeCustomers, setActiveCustomers] = useState("0");
  const [todaySold, setTodaySold] = useState("0");
  const [totalProducts, setTotalProducts] = useState("0");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const checkUserLogin = () => {
      const userRole = localStorage.getItem("userRole");
      const adminData = localStorage.getItem("admin");
      const authToken = sessionStorage.getItem("authToken");
      
      if (userRole !== "admin" || !adminData || !authToken) {
        navigate("/");
      }
    };
    checkUserLogin();
  }, [navigate]);

  const loadProductData = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${APIURL}/LoadDashboardData.php`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response === true) {
          setActiveCustomers(data.active_customers || 0);
          setTodaySales(data.today_sales || 0);
          setTodaySold(data.today_sold || 0);
          setTotalProducts(data.total_products || 0);
          setLastUpdated(new Date());
        } else {
          toast.error(data.message);

          if (data.message === "Unauthorized") {
            sessionStorage.removeItem("authToken");
            localStorage.removeItem("userRole");
            localStorage.removeItem("admin");
            navigate("/");
          }
        }
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProductData();
  }, [APIURL, navigate]);

  useEffect(() => {
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", () => {
      window.history.pushState(null, null, window.location.pathname);
    });

    return () => {
      window.removeEventListener("popstate", () => {});
    };
  }, []);

  const stats = [
    { 
      title: "Today Sold", 
      value: todaySold, 
      icon: BarChart2, 
      trend: 12,
      color: COLORS.info
    },
    {
      title: "Today Sales",
      value: `Rs. ${todaySales}`,
      icon: DollarSign,
      trend: -2,
      color: COLORS.primary
    },
    { 
      title: "Total Products", 
      value: totalProducts, 
      icon: Package, 
      trend: 5,
      color: COLORS.secondary
    },
    { 
      title: "Active Customers", 
      value: activeCustomers, 
      icon: Users, 
      trend: 8,
      color: COLORS.success
    },
  ];

  const quickActions = [
    {
      title: "View Sales Overview",
      description: "Detailed sales analytics and trends",
      icon: BarChart2,
      onClick: () => navigate("../sales-overview"),
      color: COLORS.primary
    },
    {
      title: "Manage Orders",
      description: "View and update order status",
      icon: Package,
      onClick: () => navigate("../orders"),
      color: COLORS.info
    },
    {
      title: "Customer Management",
      description: "View customer details and status",
      icon: Users,
      onClick: () => navigate("../customers"),
      color: COLORS.success
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 animate-pulse">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with your business today.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-2" />
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <button
              onClick={loadProductData}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-lg"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <QuickActionCard key={action.title} {...action} />
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-8">
          {/* Sales Trend */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Sales Trend</h2>
                <p className="text-gray-600">Monitor your daily sales performance</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Activity size={20} className="text-yellow-600" />
              </div>
            </div>
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

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Top Performing Products</h2>
                <p className="text-gray-600">Your best-selling items today</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Package size={20} className="text-green-600" />
              </div>
            </div>
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

        {/* Recent Activity Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Today's Summary</h2>
            <Eye size={20} className="text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{todaySold}</p>
              <p className="text-sm text-gray-600">Items Sold Today</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">Rs. {todaySales}</p>
              <p className="text-sm text-gray-600">Revenue Generated</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{activeCustomers}</p>
              <p className="text-sm text-gray-600">Active Customers</p>
            </div>
          </div>
        </div>
      </div>
      
      <ToastContainer />
    </div>
  );
}
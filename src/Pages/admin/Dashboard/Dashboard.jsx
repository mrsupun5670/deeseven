import React, { useEffect, useState } from "react";
import { Users, Package, DollarSign, BarChart2 } from "lucide-react";
import AnimatedContent from "../../../Components/AnimatedContent";
import LineChart from "../../../Components/LineChart";
import BarChart from "../../../Components/BarChart";
import TopProducts from "../../../Components/TopProducts";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";

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
  const APIURL = import.meta.env.VITE_API_URL || "";
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [todaySales, setTodaySales] = useState("0.00");
  const [activeCustomers, setActiveCustomers] = useState("0");
  const [todaySold, setTodaySold] = useState("0");
  const [totalProducts, setTotalProducts] = useState("0");


  useEffect(() => {
    const checkUserLogin = () => {
      if (localStorage.getItem("userRole") !== "admin") {
        if (localStorage.getItem("admin") === null) {
          navigate("/");
        }
      }
    };
    checkUserLogin();
  }, []);

  useEffect(() => {
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
        // console.error("Error loading data:", error);
        toast.error("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };

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
    { title: "Today Sold", value: todaySold, icon: BarChart2, trend: 12 },
    {
      title: "Today Sales",
      value: "Rs."+todaySales+".00",
      icon: DollarSign,
      trend: -2,
    },
    { title: "Total Products", value: totalProducts, icon: Package, trend: 5 },
    { title: "Active Customers", value: activeCustomers, icon: Users, trend: 8 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <div className="space-y-4 text-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
            <p className="text-muted-foreground animate-pulse">
              Loading data...
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
          <div className="flex flex-col lg:flex-row w-full gap-4">
            <div className="w-full">
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
            {/* <div className="w-full lg:w-1/3"> 
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
            </div>*/}
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
        </>
      )}
      <ToastContainer />
    </div>
  );
}

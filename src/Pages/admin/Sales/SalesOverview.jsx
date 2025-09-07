import React, { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Calendar,
  Download,
  Eye,
  MapPin,
  Shirt,
  Filter,
  RefreshCw
} from "lucide-react";

const COLORS = {
  primary: '#feb701',
  secondary: '#f59e0b',
  success: '#10b981',
  danger: '#ef4444',
  info: '#3b82f6',
  gray: '#6b7280',
  light: '#f9fafb'
};

const CHART_COLORS = ['#feb701', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'];

const SalesOverview = () => {
  const [data, setData] = useState({
    overview_stats: {},
    sales_trend: [],
    top_products: [],
    category_breakdown: [],
    size_analytics: [],
    geographic_data: [],
    order_status_breakdown: [],
    customer_metrics: {},
    revenue_breakdown: {}
  });
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeView, setActiveView] = useState('overview');
  const componentRef = useRef();

  const APIURL = import.meta.env.VITE_API_URL || "";

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${APIURL}/LoadSalesData.php?period=${period}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.response) {
          setData(result);
          setLastUpdated(new Date());
        }
      }
    } catch (error) {
      console.error("Failed to load sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

  }, [period]);

  const formatCurrency = (value) => `Rs. ${(value || 0).toLocaleString()}`;
  const formatNumber = (value) => (value || 0).toLocaleString();

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]).join(',');
    const csvContent = [
      headers,
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${period}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const StatCard = ({ title, value, change, icon: Icon, color = COLORS.primary }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 transform transition-all hover:scale-105" style={{borderLeftColor: color}}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
          {change !== undefined && (
            <div className={`flex items-center mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="ml-1 text-sm font-medium">{Math.abs(change)}%</span>
              <span className="ml-1 text-xs text-gray-500">vs prev period</span>
            </div>
          )}
        </div>
        <div className="p-3 rounded-full" style={{backgroundColor: `${color}20`}}>
          <Icon size={24} style={{color: color}} />
        </div>
      </div>
    </div>
  );

  const PeriodSelector = () => (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {[
        { key: 'today', label: 'Today' },
        { key: 'week', label: 'This Week' },
        { key: 'month', label: 'This Month' },
        { key: 'year', label: 'This Year' }
      ].map(({ key, label }) => (
        <button
          key={key}
          onClick={() => setPeriod(key)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            period === key
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const ViewSelector = () => (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {[
        { key: 'overview', label: 'Overview', icon: BarChart },
        { key: 'products', label: 'Products', icon: Package },
        { key: 'geography', label: 'Geography', icon: MapPin }
      ].map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setActiveView(key)}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeView === key
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Icon size={16} className="mr-2" />
          {label}
        </button>
      ))}
    </div>
  );

  const TopProductsTable = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top 10 Products</h3>
        <button 
          onClick={() => exportToCSV(data.top_products, 'top_products')}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          <Download size={16} className="mr-2" />
          Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">Units Sold</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">Revenue</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700">Category</th>
            </tr>
          </thead>
          <tbody>
            {data.top_products.map((product, index) => (
              <tr key={product.product_id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg mr-3 flex items-center justify-center text-xs font-medium text-yellow-800">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 truncate max-w-xs">{product.title}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                </td>
                <td className="text-right py-4 px-4 font-medium">{formatNumber(product.units_sold)}</td>
                <td className="text-right py-4 px-4 font-medium">{formatCurrency(product.revenue)}</td>
                <td className="text-right py-4 px-4 text-sm text-gray-600">{product.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const CategoryPieChart = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
        <button 
          onClick={() => exportToCSV(data.category_breakdown, 'category_breakdown')}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          <Download size={16} className="mr-2" />
          Export
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data.category_breakdown}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={2}
            dataKey="revenue"
            nameKey="name"
          >
            {data.category_breakdown.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value)} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-1 gap-2">
        {data.category_breakdown.map((category, index) => (
          <div key={category.name} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-3"
                style={{backgroundColor: CHART_COLORS[index % CHART_COLORS.length]}}
              />
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </div>
            <span className="text-sm text-gray-600">{formatCurrency(category.revenue)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const SalesTrendChart = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
        <button 
          onClick={() => exportToCSV(data.sales_trend, 'sales_trend')}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          <Download size={16} className="mr-2" />
          Export
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data.sales_trend}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{fontSize: 12}}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis tick={{fontSize: 12}} />
          <Tooltip 
            formatter={(value, name) => [
              name === 'sales' ? formatCurrency(value) : formatNumber(value),
              name === 'sales' ? 'Sales' : 'Orders'
            ]}
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke={COLORS.primary}
            fill={`${COLORS.primary}30`}
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const SizeAnalytics = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Size Analytics</h3>
        <Shirt size={20} className="text-gray-400" />
      </div>
      <div className="space-y-4">
        {data.size_analytics.slice(0, 10).map((size, index) => {
          const maxSold = Math.max(...data.size_analytics.map(s => s.sold));
          const percentage = (size.sold / maxSold) * 100;
          
          return (
            <div key={`${size.size}-${size.type}`} className="flex items-center">
              <div className="w-12 text-sm font-medium text-gray-700">{size.size}</div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: CHART_COLORS[index % CHART_COLORS.length]
                    }}
                  />
                </div>
              </div>
              <div className="w-16 text-right text-sm font-medium text-gray-900">
                {formatNumber(size.sold)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const GeographicData = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Locations</h3>
        <button 
          onClick={() => exportToCSV(data.geographic_data, 'geographic_data')}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
        >
          <Download size={16} className="mr-2" />
          Export
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {data.geographic_data.slice(0, 10).map((location, index) => (
          <div key={`${location.district}-${location.city}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full mr-3 flex items-center justify-center text-xs font-medium text-yellow-800">
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{location.city}</p>
                <p className="text-sm text-gray-500">{location.district}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">{formatNumber(location.orders)} orders</p>
              <p className="text-sm text-gray-500">{formatCurrency(location.revenue)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const OrderStatusChart = () => (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
        <ShoppingCart size={20} className="text-gray-400" />
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data.order_status_breakdown} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="status" type="category" width={80} />
          <Tooltip formatter={(value) => formatNumber(value)} />
          <Bar dataKey="count" fill={COLORS.primary} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sales data...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mt-4 md:mt-0">
            <PeriodSelector />
            <button
              onClick={fetchData}
              className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Sales"
            value={formatCurrency(data.overview_stats.total_sales)}
            change={data.overview_stats.sales_change}
            icon={DollarSign}
            color={COLORS.primary}
          />
          <StatCard
            title="Total Orders"
            value={formatNumber(data.overview_stats.total_orders)}
            change={data.overview_stats.orders_change}
            icon={ShoppingCart}
            color={COLORS.info}
          />
          <StatCard
            title="Avg Order Value"
            value={formatCurrency(data.overview_stats.avg_order_value)}
            change={data.overview_stats.avg_order_change}
            icon={Package}
            color={COLORS.success}
          />
          <StatCard
            title="Unique Customers"
            value={formatNumber(data.overview_stats.unique_customers)}
            change={data.overview_stats.customers_change}
            icon={Users}
            color={COLORS.secondary}
          />
        </div>

        {/* View Selector */}
        <div className="mb-6">
          <ViewSelector />
        </div>

        {/* Content based on active view */}
        {activeView === 'overview' && (
          <>
            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <SalesTrendChart />
              </div>
              <div>
                <CategoryPieChart />
              </div>
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <SizeAnalytics />
              <OrderStatusChart />
            </div>
          </>
        )}

        {activeView === 'products' && (
          <div className="grid grid-cols-1 gap-6 mb-8">
            <TopProductsTable />
          </div>
        )}

        {activeView === 'geography' && (
          <div className="grid grid-cols-1 gap-6 mb-8">
            <GeographicData />
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesOverview;
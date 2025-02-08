import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, TrendingDown, Package, DollarSign, Users, ShoppingCart } from 'lucide-react';

// Sample data with Sri Lankan Rupees
const monthlyData = [
  { month: 'Jan', sales: 11200000, orders: 220, profit: 3840000 },
  { month: 'Feb', sales: 13440000, orders: 240, profit: 4800000 },
  { month: 'Mar', sales: 12160000, orders: 200, profit: 4160000 },
  { month: 'Apr', sales: 14400000, orders: 280, profit: 5120000 },
  { month: 'May', sales: 16640000, orders: 300, profit: 6080000 },
  { month: 'Jun', sales: 15360000, orders: 275, profit: 5440000 },
];

const topProducts = [
  { name: 'T-Shirts', value: 35 },
  { name: 'Pants', value: 25 },
  { name: 'Jackets', value: 20 },
  { name: 'Innerwear', value: 15 },
  { name: 'Others', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const formatLKR = (value) => {
  return `Rs. ${new Intl.NumberFormat('si-LK').format(value)}`;
};

const SalesOverview = () => {
  const stats = [
    {
      title: 'Total Sales',
      value: formatLKR(16640000),
      change: '+12%',
      isPositive: true,
      icon: DollarSign,
    },
    {
      title: 'Total Orders',
      value: '300',
      change: '+8%',
      isPositive: true,
      icon: ShoppingCart,
    },
    {
      title: 'Total Products',
      value: '1,250',
      change: '+5%',
      isPositive: true,
      icon: Package,
    },
    {
      title: 'Total Customers',
      value: '850',
      change: '-3%',
      isPositive: false,
      icon: Users,
    },
  ];

  // Custom tooltip formatter for charts
  const customTooltipFormatter = (value, name) => {
    if (name.includes('Sales') || name.includes('Profit')) {
      return formatLKR(value);
    }
    return value;
  };

  // Stats Card Component
  const StatsCard = ({ title, value, change, isPositive, icon: Icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <div className="flex items-center mt-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {change} this month
            </span>
          </div>
        </div>
        <div className="p-3 bg-blue-50 rounded-full">
          <Icon className="w-6 h-6 text-blue-500" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Sales Overview</h1>
          <p className="text-gray-500 mt-1">Welcome to your sales dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Trend Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Sales Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `Rs. ${value/1000000}M`} />
                <Tooltip formatter={customTooltipFormatter} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#0088FE" 
                  name="Sales (Rs.)"
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#00C49F" 
                  name="Profit (Rs.)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Orders Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Monthly Orders</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#8884d8" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Categories Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Product Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProducts}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {topProducts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">Product</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-right py-3 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4">#ORD-{2340 + index}</td>
                      <td className="py-3 px-4">T-Shirt</td>
                      <td className="py-3 px-4">John Doe</td>
                      <td className="py-3 px-4 text-right">{formatLKR(28480)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
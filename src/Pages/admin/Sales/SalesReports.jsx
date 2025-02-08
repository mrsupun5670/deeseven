import React, { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Calendar, Download, Filter, Printer, 
  ArrowDown, ArrowUp, FileText 
} from 'lucide-react';
import * as XLSX from 'xlsx';

// Sample data - Replace with your API data
const salesData = [
  { date: '2024-01', revenue: 11200000, expenses: 8000000, profit: 3200000 },
  { date: '2024-02', revenue: 13440000, expenses: 9100000, profit: 4340000 },
  { date: '2024-03', revenue: 12160000, expenses: 8500000, profit: 3660000 },
  { date: '2024-04', revenue: 14400000, expenses: 9800000, profit: 4600000 },
  { date: '2024-05', revenue: 16640000, expenses: 11200000, profit: 5440000 },
  { date: '2024-06', revenue: 15360000, expenses: 10400000, profit: 4960000 },
];

const inventoryData = [
  { date: '2024-01', stock: 500, sold: 300, remaining: 200 },
  { date: '2024-02', stock: 600, sold: 350, remaining: 250 },
  { date: '2024-03', stock: 550, sold: 320, remaining: 230 },
  { date: '2024-04', stock: 700, sold: 400, remaining: 300 },
];

const formatLKR = (value) => `Rs. ${new Intl.NumberFormat('si-LK').format(value)}`;

const SalesReports = () => {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('sales');
  
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportType === 'sales' ? salesData : inventoryData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${reportType}-report.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Reports</h1>
            <div className="flex flex-wrap gap-4">
              <select 
                className="px-4 py-2 border rounded-lg"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="sales">Sales Report</option>
                <option value="inventory">Inventory Report</option>
              </select>
              <select 
                className="px-4 py-2 border rounded-lg"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg">
                <Download className="w-4 h-4" />
                Export Excel
              </button>
              <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg">
                <Printer className="w-4 h-4" />
                Print Report
              </button>
            </div>
          </div>
        </div>

        {reportType === 'sales' ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `Rs. ${value / 1000000}M`} />
              <Tooltip formatter={(value) => formatLKR(value)} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#0088FE" name="Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="#FF8042" name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="stock" fill="#0088FE" name="Stock" />
              <Bar dataKey="sold" fill="#FF8042" name="Sold" />
              <Bar dataKey="remaining" fill="#00C49F" name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesReports;

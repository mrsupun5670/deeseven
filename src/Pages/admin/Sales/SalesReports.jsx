import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Download,
  Filter,
  Printer,
  ArrowDown,
  ArrowUp,
  FileText,
  BarChart2,
  LineChart as LineChartIcon,
} from "lucide-react";
import jsPDF from "jspdf";

// Sample data remains the same
const salesData = [
  { date: "2024-01", revenue: 11200000, expenses: 8000000, profit: 3200000 },
  { date: "2024-02", revenue: 13440000, expenses: 9100000, profit: 4340000 },
  { date: "2024-03", revenue: 12160000, expenses: 8500000, profit: 3660000 },
  { date: "2024-04", revenue: 14400000, expenses: 9800000, profit: 4600000 },
  { date: "2024-05", revenue: 16640000, expenses: 11200000, profit: 5440000 },
  { date: "2024-06", revenue: 15360000, expenses: 10400000, profit: 4960000 },
];

const inventoryData = [
  { date: "2024-01", stock: 500, sold: 300, remaining: 200 },
  { date: "2024-02", stock: 600, sold: 350, remaining: 250 },
  { date: "2024-03", stock: 550, sold: 320, remaining: 230 },
  { date: "2024-04", stock: 700, sold: 400, remaining: 300 },
];

const formatLKR = (value) =>
  `Rs. ${new Intl.NumberFormat("si-LK").format(value)}`;

const SalesReports = () => {
  const [dateRange, setDateRange] = useState("month");
  const [reportType, setReportType] = useState("sales");

  const handleExport = () => {
    const data = reportType === 'sales' ? salesData : inventoryData;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${reportType}-report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(reportType === 'sales' ? 'Sales Report' : 'Inventory Report', 14, 15);
    
    // Add date range
    doc.setFontSize(12);
    doc.text(`Period: ${dateRange}`, 14, 25);
    
    if (reportType === 'sales') {
      // Add summary section
      const currentPeriodData = salesData[salesData.length - 1];
      doc.setFontSize(14);
      doc.text('Summary', 14, 35);
      doc.setFontSize(10);
      doc.text(`Total Revenue: ${formatLKR(currentPeriodData.revenue)}`, 14, 45);
      doc.text(`Total Expenses: ${formatLKR(currentPeriodData.expenses)}`, 14, 52);
      doc.text(`Total Profit: ${formatLKR(currentPeriodData.profit)}`, 14, 59);
      
      // Add detailed sales table
      const tableColumn = ["Date", "Revenue (Rs.)", "Expenses (Rs.)", "Profit (Rs.)"];
      const tableRows = salesData.map((item) => [
        item.date,
        new Intl.NumberFormat('si-LK').format(item.revenue),
        new Intl.NumberFormat('si-LK').format(item.expenses),
        new Intl.NumberFormat('si-LK').format(item.profit)
      ]);

      doc.autoTable({
        startY: 70,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      });
    } else {
      // Add inventory summary
      const currentInventory = inventoryData[inventoryData.length - 1];
      doc.setFontSize(14);
      doc.text('Current Inventory Status', 14, 35);
      doc.setFontSize(10);
      doc.text(`Total Stock: ${currentInventory.stock}`, 14, 45);
      doc.text(`Total Sold: ${currentInventory.sold}`, 14, 52);
      doc.text(`Remaining: ${currentInventory.remaining}`, 14, 59);

      // Add detailed inventory table
      const tableColumn = ["Date", "Initial Stock", "Sold", "Remaining"];
      const tableRows = inventoryData.map((item) => [
        item.date,
        item.stock,
        item.sold,
        item.remaining
      ]);

      doc.autoTable({
        startY: 70,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      });
    }

    // Add footer with date
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width - 25,
        doc.internal.pageSize.height - 10
      );
    }

    // Open PDF in new tab
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  };

  // Calculate summary statistics
  const currentPeriodData = salesData[salesData.length - 1];
  const previousPeriodData = salesData[salesData.length - 2];
  const revenueGrowth = ((currentPeriodData.revenue - previousPeriodData.revenue) / previousPeriodData.revenue) * 100;
  const profitGrowth = ((currentPeriodData.profit - previousPeriodData.profit) / previousPeriodData.profit) * 100;


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Financial Reports
            </h1>
            <p className="text-gray-500 mt-1">
              Track your business performance
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              className="px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Rest of the component remains the same... */}
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Revenue
              </h3>
              <LineChartIcon className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold mb-2">
              {formatLKR(currentPeriodData.revenue)}
            </div>
            <div
              className={`flex items-center text-xs ${
                revenueGrowth >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {revenueGrowth >= 0 ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(revenueGrowth).toFixed(1)}% from last period
            </div>
          </div>

          {/* Profit Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Total Profit
              </h3>
              <BarChart2 className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold mb-2">
              {formatLKR(currentPeriodData.profit)}
            </div>
            <div
              className={`flex items-center text-xs ${
                profitGrowth >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {profitGrowth >= 0 ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(profitGrowth).toFixed(1)}% from last period
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-600">Expenses</h3>
              <FileText className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold mb-2">
              {formatLKR(currentPeriodData.expenses)}
            </div>
            <div className="text-xs text-gray-500">Current period</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Performance Overview
            </h2>
            <p className="text-sm text-gray-500">
              View detailed metrics for your business
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setReportType("sales")}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                reportType === "sales"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <LineChartIcon className="w-4 h-4" />
              Sales Analysis
            </button>
            <button
              onClick={() => setReportType("inventory")}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                reportType === "inventory"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Inventory Status
            </button>
          </div>

          {/* Charts */}
          <div className="h-[400px]">
            {reportType === "sales" ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `Rs. ${value / 1000000}M`} />
                  <Tooltip formatter={(value) => formatLKR(value)} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0088FE"
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#FF8042"
                    name="Expenses"
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#00C49F"
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
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
      </div>
    </div>
  );
};

export default SalesReports;

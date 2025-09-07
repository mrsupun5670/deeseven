import React, { useEffect, useState } from "react";
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
  Download,
  Printer,
  ArrowDown,
  ArrowUp,
  FileText,
  BarChart2,
  LineChart as LineChartIcon,
} from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable"; // important to import this

const formatLKR = (value) =>
  `Rs. ${new Intl.NumberFormat("si-LK").format(value)}`;

const SalesReports = () => {
  const [dateRange, setDateRange] = useState("month");
  const [reportType, setReportType] = useState("sales");
  const [salesData, setSalesData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  // Fetch data from backend based on dateRange
  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/getSalesReports.php?filter=${dateRange}`,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.response) {
          setSalesData(data.sales_data || []);
          setInventoryData(data.inventory_data || []);
        }
      })
      .catch((err) => console.error("Error:", err));
  }, [dateRange]);

  // Export CSV
  const handleExport = () => {
    const data = reportType === "sales" ? salesData : inventoryData;
    if (!data.length) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((h) => row[h]).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `${reportType}-report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF
  const handlePrint = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(reportType === "sales" ? "Sales Report" : "Inventory Report", 14, 15);

    doc.setFontSize(12);
    doc.text(`Period: ${dateRange}`, 14, 25);

    if (reportType === "sales" && salesData.length) {
      const current = salesData[salesData.length - 1];
      doc.setFontSize(14);
      doc.text("Summary", 14, 35);
      doc.setFontSize(10);
      doc.text(`Total Revenue: ${formatLKR(current.revenue)}`, 14, 45);
      doc.text(`Total Expenses: ${formatLKR(current.expenses)}`, 14, 52);
      doc.text(`Total Profit: ${formatLKR(current.profit)}`, 14, 59);

      const tableRows = salesData.map((item) => [
        item.date,
        formatLKR(item.revenue),
        formatLKR(item.expenses),
        formatLKR(item.profit),
      ]);

      doc.autoTable({
        startY: 70,
        head: [["Date", "Revenue", "Expenses", "Profit"]],
        body: tableRows,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      });
    } else if (inventoryData.length) {
      const current = inventoryData[inventoryData.length - 1];
      doc.setFontSize(14);
      doc.text("Current Inventory Status", 14, 35);
      doc.setFontSize(10);
      doc.text(`Total Stock: ${current.stock}`, 14, 45);
      doc.text(`Total Sold: ${current.sold}`, 14, 52);
      doc.text(`Remaining: ${current.remaining}`, 14, 59);

      const tableRows = inventoryData.map((item) => [
        item.date,
        item.stock,
        item.sold,
        item.remaining,
      ]);

      doc.autoTable({
        startY: 70,
        head: [["Date", "Stock", "Sold", "Remaining"]],
        body: tableRows,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      });
    }

    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, doc.internal.pageSize.height - 10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
    }

    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  };

  const current = salesData[salesData.length - 1] || { revenue: 0, expenses: 0, profit: 0 };
  const previous = salesData[salesData.length - 2] || { revenue: 0, profit: 0 };

  const revenueGrowth = previous.revenue
    ? ((current.revenue - previous.revenue) / previous.revenue) * 100
    : 0;

  const profitGrowth = previous.profit
    ? ((current.profit - previous.profit) / previous.profit) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Financial Reports</h1>
            <p className="text-gray-500 mt-1">Track your business performance</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              className="px-4 py-2 border rounded-lg bg-white shadow-sm focus:outline-none"
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
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              <LineChartIcon className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold mb-2">{formatLKR(current.revenue)}</div>
            <div className={`flex items-center text-xs ${revenueGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
              {revenueGrowth >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {Math.abs(revenueGrowth).toFixed(1)}% from last period
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Profit</h3>
              <BarChart2 className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold mb-2">{formatLKR(current.profit)}</div>
            <div className={`flex items-center text-xs ${profitGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
              {profitGrowth >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {Math.abs(profitGrowth).toFixed(1)}% from last period
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-600">Expenses</h3>
              <FileText className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold mb-2">{formatLKR(current.expenses)}</div>
            <div className="text-xs text-gray-500">Current period</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800">Performance Overview</h2>
            <p className="text-sm text-gray-500">View detailed metrics for your business</p>
          </div>

          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setReportType("sales")}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                reportType === "sales" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
              }`}
            >
              <LineChartIcon className="w-4 h-4" />
              Sales Analysis
            </button>
            <button
              onClick={() => setReportType("inventory")}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                reportType === "inventory" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500"
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              Inventory Status
            </button>
          </div>

          <div className="h-[400px]">
            {reportType === "sales" ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `Rs. ${value / 1000000}M`} />
                  <Tooltip formatter={(value) => formatLKR(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#0088FE" name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#FF8042" name="Expenses" />
                  <Line type="monotone" dataKey="profit" stroke="#00C49F" name="Profit" />
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

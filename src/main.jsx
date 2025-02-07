import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import AdminLayout from "./Components/Layout/AdminLayout.jsx";
import Dashboard from "./Pages/admin/Dashboard/Dashboard.jsx";
import ProductsList from "./Pages/admin/Products/ProductList.jsx";
import ProductAdd from "./Pages/admin/Products/ProductAdd.jsx";
import ProductEdit from "./Pages/admin/Products/ProductEdit.jsx";
import CustomersList from "./Pages/admin/Customers/CustomersList.jsx";
import OrdersList from "./Pages/admin/Orders/OrdersList.jsx";
// import ProductCategories from "./Pages/admin/Products/ProductCategories.jsx";
// import ProductInventory from "./Pages/admin/Products/ProductInventory.jsx";
// import SalesOverview from "./Pages/admin/Sales/SalesOverview.jsx";
// import SalesReports from "./Pages/admin/Sales/SalesReports.jsx";
// import SalesAnalytics from "./Pages/admin/Sales/SalesAnalytics.jsx";
// import PaymentHistory from "./Pages/admin/Payments/PaymentHistory.jsx";
// import PaymentMethods from "./Pages/admin/Payments/PaymentMethods.jsx";
// import PaymentRefunds from "./Pages/admin/Payments/PaymentRefunds.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="orders" element={<OrdersList />} />
        
        <Route path="products">
          <Route index element={<ProductsList />} />
          <Route path="view" element={<ProductsList />} />
          <Route path="add" element={<ProductAdd />} />
          <Route path="edit" element={<ProductEdit />} />
          {/* <Route path="categories" element={<ProductCategories />} /> */}
        </Route>
        
        <Route path="customers" element={<CustomersList />} />
        
        {/* <Route path="sales">
          <Route index element={<SalesOverview />} />
          <Route path="overview" element={<SalesOverview />} />
          <Route path="reports" element={<SalesReports />} />
          <Route path="analytics" element={<SalesAnalytics />} />
        </Route>
        
        <Route path="payments">
          <Route index element={<PaymentHistory />} />
          <Route path="history" element={<PaymentHistory />} />
          <Route path="methods" element={<PaymentMethods />} />
          <Route path="refunds" element={<PaymentRefunds />} />
        </Route> */}
      </Route>
    </Routes>
  </BrowserRouter>
);
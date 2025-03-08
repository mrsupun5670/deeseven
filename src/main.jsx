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
import ProductCategories from "./Pages/admin/Products/ProductCategories.jsx";
import SalesOverview from "./Pages/admin/Sales/SalesOverview.jsx";
import SalesReports from "./Pages/admin/Sales/SalesReports.jsx";
import TransactionHistory from "./Pages/admin/payments/TransactionHistory.jsx";
import Index from "./Pages/index.jsx";
import MyAccount from "./Pages/MyAccount.jsx";
import Checkout from "./Pages/Checkout.jsx";
import CategoryView from "./Pages/CategoryView.jsx";
import SingleProduct from "./Components/SingleProduct.jsx";


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/myaccount" element={<MyAccount />} />
      <Route path="/men" element={<CategoryView />} />
      <Route path="/women" element={<CategoryView />} />
      <Route path="/product/:id" element={<SingleProduct />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route path="orders" element={<OrdersList />} />
        
        <Route path="products">
          <Route index element={<ProductsList />} />
          <Route path="view" element={<ProductsList />} />
          <Route path="add" element={<ProductAdd />} />
          <Route path="edit" element={<ProductEdit />} />
          <Route path="categories" element={<ProductCategories />} />
        </Route>
        
        <Route path="customers" element={<CustomersList />} />
        
        <Route path="sales">
          <Route index element={<SalesOverview />} />
          <Route path="overview" element={<SalesOverview />} />
          <Route path="reports" element={<SalesReports />} />
        </Route>
        
        <Route path="payments">
          <Route index element={<TransactionHistory />} />
          <Route path="history" element={<TransactionHistory />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
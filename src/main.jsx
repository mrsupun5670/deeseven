import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";

import Index from "./Pages/index.jsx";
import CheckoutPage from "./Pages/Checkout.jsx";
import CategoryView from "./Pages/CategoryView.jsx";
import AdminLayout from "./Components/Layout/AdminLayout.jsx";
import Dashboard from "./Pages/admin/Dashboard/Dashboard.jsx";
import ProductsList from "./Pages/admin/Products/ProductList.jsx";
import ProductAdd from "./Pages/admin/Products/ProductAdd.jsx";
import ProductEdit from "./Pages/admin/Products/ProductEdit.jsx";
import CustomersList from "./Pages/admin/Customers/CustomersList.jsx";
import OrdersList from "./Pages/admin/Orders/OrdersList.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />

        <Route path="/admin/products/view" element={<ProductsList />} />
        <Route path="/admin/products/add" element={<ProductAdd />} />
        <Route path="/admin/products/edit" element={<ProductEdit />} />

        <Route path="/admin/orders/all" element={<OrdersList />} />

        <Route path="/admin/customers/all" element={<CustomersList />} />

      </Route>
    </Routes>
  </BrowserRouter>
);

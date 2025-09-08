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
import Returns from "./Pages/admin/returns/Returns.jsx";
import Index from "./Pages/index.jsx";
import MyAccount from "./Pages/MyAccount.jsx";
import TermsConditions from "./Pages/Terms&Conditions.jsx";
import Checkout from "./Pages/Checkout.jsx";
import CategoryView from "./Pages/CategoryView.jsx";
import CartProvider from "./context/CartProvider.jsx";
import SingleProductPage from "./Pages/singleProductView.jsx";
import Store from "./Pages/Store.jsx";
import NotFound from "./Pages/NotFound.jsx";
import PaymentSuccess from "./Pages/PaymentSuccess.jsx";
import ReturnPolicy from "./Pages/ReturnPolicy.jsx";
import Policy from "./Pages/Policy.jsx";
import ContactUs from "./Pages/ContactUs.jsx";
import AboutUs from "./Pages/AboutUs.jsx";

createRoot(document.getElementById("root")).render(
  <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<Index />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/men" element={<CategoryView title="Men" />} />
        <Route path="/women" element={<CategoryView title="Women" />} />
        <Route path="/product/:id" element={<SingleProductPage />} />
        <Route path="/account" element={<MyAccount />} />
        <Route path="/terms_conditions" element={<TermsConditions />} />
        <Route path="/privacy_policy" element={<Policy />} />
        <Route path="/contact_us" element={<ContactUs />} />
        <Route path="/about_us" element={<AboutUs />} />
        <Route path="/return_policy" element={<ReturnPolicy />} />
        <Route path="/store" element={<Store />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="orders" element={<OrdersList />} />

          <Route path="products">
            <Route index element={<ProductsList />} />
            <Route path="view" element={<ProductsList />} />
            <Route path="add" element={<ProductAdd />} />
            <Route path="edit/:productId" element={<ProductEdit />} />
            <Route path="categories" element={<ProductCategories />} />
          </Route>

          <Route path="customers" element={<CustomersList />} />

          <Route path="sales-overview" element={<SalesOverview />} />

         
            <Route path="returns" element={<Returns />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </CartProvider>
);

import { createRoot } from 'react-dom/client'
import './index.css'
import Index from './Pages/index.jsx'
import { BrowserRouter, Route, Routes } from "react-router";
import CheckoutPage from './Pages/Checkout.jsx';
import CategoryView from './Pages/CategoryView.jsx';
import AdminLayout from './Components/Layout/AdminLayout.jsx';
import Dashboard from './Pages/admin/Dashboard/Dashboard.jsx';

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
    <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/">
            {/* <Route path="all" element={<OrdersList />} />
            <Route path="pending" element={<PendingOrders />} /> */}
            {/* other order routes */}
          </Route>
          {/* other routes */}
        </Route>
      </Routes>
 </BrowserRouter>
)

import { createRoot } from 'react-dom/client'
import './index.css'
import Index from './Pages/index.jsx'
import { BrowserRouter, Route, Routes } from "react-router";
import CheckoutPage from './Pages/Checkout.jsx';

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
    <Routes>
      <Route path="*" element={<h1>Not Found</h1>} />
      <Route path="/" element={<Index />} />
    </Routes>
 </BrowserRouter>
)

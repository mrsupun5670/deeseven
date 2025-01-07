import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Index from './Pages/index.jsx'
import { BrowserRouter, Route, Routes } from "react-router";
import SignUp from './Pages/SignupPage.jsx';
import Signin from './Pages/Signin.jsx';


createRoot(document.getElementById('root')).render(
 <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
 </BrowserRouter>
)

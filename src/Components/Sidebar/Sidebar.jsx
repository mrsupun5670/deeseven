import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Package, Users, ShoppingCart, CreditCard, BarChart2,
  Plus, Edit, Trash2, Box, Tag, Clock, 
  ChevronDown, ChevronUp,
  X, LogOut, User
} from "lucide-react";
import logo from "../../assets/logoW.png";
import { toast } from 'react-toastify';

const navigationConfig = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Orders",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    path: "/admin/products",
    icon: Package,
    submenu: [
      { title: "View Products", path: "/admin/products/view" },
      { title: "Add Product", path: "/admin/products/add", icon: Plus },
      { title: "Categories", path: "/admin/products/categories", icon: Tag },
    ],
  },
  {
    title: "Customers",
    path: "/admin/customers",
    icon: Users,
  },
  {
    title: "Sales",
    path: "/admin/sales-overview",
    icon: BarChart2,
  },
  {
    title: "Returns",
    path: "/admin/returns",
    icon: CreditCard,
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const [openMenus, setOpenMenus] = useState(new Set());
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const APIURL = import.meta.env.VITE_API_URL;

  const toggleMenu = (path) => {
    setOpenMenus((prev) => {
      const newSet = new Set(prev);
      newSet.has(path) ? newSet.delete(path) : newSet.add(path);
      return newSet;
    });
  };

  const isActiveLink = (path) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    
    try {
      const response = await fetch(`${APIURL}/LogoutController.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
        },
      });

      const data = await response.json();
      
      if (data.response) {
        // Clear session storage
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('adminEmail');
        sessionStorage.removeItem('adminId');
        
        // Show success message
        toast.success('Logged out successfully');
        
        // Redirect to login page
        navigate('/admin/login');
      } else {
        toast.error(data.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API fails, clear local session and redirect
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('adminEmail');
      sessionStorage.removeItem('adminId');
      
      toast.info('Session cleared');
      navigate('/admin/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const renderMenuItem = (item) => {
    const isOpen = openMenus.has(item.path);
    const isActive = isActiveLink(item.path);
    const Icon = item.icon;

    return (
      <div key={item.path} className="w-full">
        {item.submenu ? (
          <div>
            <button
              onClick={() => toggleMenu(item.path)}
              className={`flex items-center justify-between w-full px-4 py-3 hover:bg-slate-700 transition-colors 
                ${isActive ? "bg-slate-700" : ""}`}
            >
              <div className="flex items-center space-x-3">
                {Icon && <Icon className="w-5 h-5" />}
                <span>{item.title}</span>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isOpen && (
              <div className="bg-slate-800">
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={`block px-8 py-2 hover:bg-slate-700 transition-colors 
                      ${isActiveLink(subItem.path) ? "bg-slate-700" : ""}`}
                    onClick={() => window.innerWidth < 1024 && onClose()}
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Link
            to={item.path}
            className={`flex items-center justify-between w-full px-4 py-3 hover:bg-slate-700 transition-colors 
              ${isActive ? "bg-slate-700" : ""}`}
            onClick={() => window.innerWidth < 1024 && onClose()}
          >
            <div className="flex items-center space-x-3">
              {Icon && <Icon className="w-5 h-5" />}
              <span>{item.title}</span>
            </div>
          </Link>
        )}
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-slate-900 text-white transform 
          transition-transform duration-300 ease-in-out z-30 flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <img src={logo} alt="Logo" className="w-16 md:w-24" />
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button onClick={onClose} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4 flex-1 overflow-y-auto">
          {navigationConfig.map(renderMenuItem)}
        </nav>

        {/* Admin Info & Logout Section */}
        <div className="border-t border-slate-700 p-4 space-y-3">
          {/* Admin Info */}
          <div className="flex items-center space-x-3 px-2 py-2 bg-slate-800 rounded-lg">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {sessionStorage.getItem('adminEmail') || 'Admin'}
              </p>
              <p className="text-xs text-slate-300">Administrator</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors
              ${isLoggingOut 
                ? 'bg-slate-600 cursor-not-allowed opacity-50' 
                : 'bg-red-600 hover:bg-red-700 active:bg-red-800'
              }`}
          >
            <LogOut className={`w-5 h-5 ${isLoggingOut ? 'animate-spin' : ''}`} />
            <span className="font-medium">
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}

export { navigationConfig };
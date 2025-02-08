import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home, Package, Users, ShoppingCart, CreditCard, BarChart2,
  Plus, Edit, Trash2, Box, Tag, Clock, 
  ChevronDown, ChevronUp,
  X
} from "lucide-react";
import logo from "../../assets/logoW.png";

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
    path: "/admin/sales",
    icon: BarChart2,
    submenu: [
      { title: "Sales Overview", path: "/admin/sales/overview" },
      { title: "Reports", path: "/admin/sales/reports" },
    ],
  },
  {
    title: "Payments",
    path: "/admin/payments",
    icon: CreditCard,
    submenu: [
      { title: "Transaction History", path: "/admin/payments/history" }
      
    ],
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const [openMenus, setOpenMenus] = useState(new Set());
  const location = useLocation();

  const toggleMenu = (path) => {
    setOpenMenus((prev) => {
      const newSet = new Set(prev);
      newSet.has(path) ? newSet.delete(path) : newSet.add(path);
      return newSet;
    });
  };

  const isActiveLink = (path) => location.pathname.startsWith(path);

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
              className={`flex items-center justify-between w-full px-4 py-3 hover:bg-gray-700 transition-colors 
                ${isActive ? "bg-gray-700" : ""}`}
            >
              <div className="flex items-center space-x-3">
                {Icon && <Icon className="w-5 h-5" />}
                <span>{item.title}</span>
              </div>
              {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isOpen && (
              <div className="bg-gray-900">
                {item.submenu.map((subItem) => (
                  <Link
                    key={subItem.path}
                    to={subItem.path}
                    className={`block px-8 py-2 hover:bg-gray-700 transition-colors 
                      ${isActiveLink(subItem.path) ? "bg-gray-700" : ""}`}
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
            className={`flex items-center justify-between w-full px-4 py-3 hover:bg-gray-700 transition-colors 
              ${isActive ? "bg-gray-700" : ""}`}
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
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-800 text-white transform 
          transition-transform duration-300 ease-in-out z-30 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                  <img src={logo} alt="Logo" className="w-16 md:w-24" />
          
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button onClick={onClose} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-4">{navigationConfig.map(renderMenuItem)}</nav>
      </aside>
    </>
  );
}

export { navigationConfig };
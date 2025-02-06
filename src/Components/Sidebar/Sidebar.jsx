import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { navigationConfig } from "../../config/navigation";

export default function Sidebar({ isOpen, onClose }) {
  const [openMenus, setOpenMenus] = useState(new Set());
  const location = useLocation();

  const toggleMenu = (path) => {
    setOpenMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
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
        <button
          onClick={() => toggleMenu(item.path)}
          className={`flex items-center justify-between w-full px-4 py-3 hover:bg-gray-700 transition-colors
            ${isActive ? "bg-gray-700" : ""}`}
        >
          <div className="flex items-center space-x-3">
            {Icon && <Icon className="w-5 h-5" />}
            <span>{item.title}</span>
          </div>
          {item.submenu &&
            (isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            ))}
        </button>

        {item.submenu && isOpen && (
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

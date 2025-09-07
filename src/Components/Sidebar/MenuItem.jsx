import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MenuItem = ({ item, isActive, isOpen, onToggle, onItemClick }) => {
  const Icon = item.icon;

  if (item.submenu) {
    return (
      <div className="w-full">
        <button
          onClick={() => onToggle(item.path)}
          className={`flex items-center justify-between w-full px-4 py-3 hover:bg-gray-700 transition-colors
            ${isActive ? 'bg-gray-700' : ''}`}
        >
          <div className="flex items-center space-x-3">
            {Icon && <Icon className="w-5 h-5" />}
            <span>{item.title}</span>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isOpen && <SubMenu items={item.submenu} onItemClick={onItemClick} />}
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-700 transition-colors
        ${isActive ? 'bg-gray-700' : ''}`}
      onClick={() => onItemClick(item.path)}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{item.title}</span>
    </Link>
  );
};

const SubMenu = ({ items, onItemClick }) => (
  <div className="bg-gray-900">
    {items.map((subItem) => (
      <Link
        key={subItem.path}
        to={subItem.path}
        onClick={() => onItemClick(subItem.path)}
        className="flex items-center space-x-2 w-full px-8 py-2 text-left hover:bg-gray-700 transition-colors"
      >
        {subItem.icon && <subItem.icon className="w-4 h-4" />}
        <span>{subItem.title}</span>
      </Link>
    ))}
  </div>
);

// src/components/Sidebar/Sidebar.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { MenuItem } from './MenuItem';
import { useLocation } from 'react-router-dom';

export const Sidebar = ({ isOpen, onClose, navigationItems }) => {
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

  const handleItemClick = (path) => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-800 text-white transform 
          transition-transform duration-300 ease-in-out z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button onClick={onClose} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-4">
          {navigationItems.map((item) => (
            <MenuItem
              key={item.path}
              item={item}
              isActive={location.pathname.startsWith(item.path)}
              isOpen={openMenus.has(item.path)}
              onToggle={toggleMenu}
              onItemClick={handleItemClick}
            />
          ))}
        </nav>
      </aside>
    </>
  );
};
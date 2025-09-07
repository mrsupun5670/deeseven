import React from 'react'

const Input = ({ type = 'text', placeholder, className = '', value, onChange, checked }) => (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${className}`}
      onChange={onChange}
      value={value}
      checked={checked}
    />
  );

export default  Input

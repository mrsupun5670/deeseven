import React from "react";
import { Link } from "react-router-dom";

export default function Breadcrumb({ paths}) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      <Link to="/" className="hover:text-black">
        Home
      </Link>
      {paths.map((path, index) => (
        <span key={index} className="flex items-center space-x-2">
          <span className="text-gray-400">/</span>
          <Link to={path.link} className="hover:text-black">
            {path.name}
          </Link>
        </span>
      ))}
    </nav>
  );
}

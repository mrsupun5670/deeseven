import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faHeart,
  faUser,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";

function Header() {
  return (
    <div className="relative p-5 z-10">
      <div className="w-full flex items-center justify-between py-2">
        <img src={logo} alt="Logo" className="w-32 sm:w-40" />
        <div className="relative w-80 max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-12 pr-4 py-2 bg-white border-2 border-[#ffb700] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#ffb700]"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#ffb700]">
            <FontAwesomeIcon icon={faSearch} />
          </div>
        </div>
      </div>
      <hr className="border-t border-gray-300" />
      <nav className="flex flex-wrap justify-between items-center p-4">
        <ul className="flex flex-wrap space-x-4 text-sm sm:space-x-6 text-center">
          <li className="hover:underline text-[#ffb700]">Home</li>
          <li className="hover:underline">Women's</li>
          <li className="hover:underline">Store</li>
          <li className="hover:underline">About Us</li>
          <li className="hover:underline">Contact</li>
        </ul>
        <ul className="flex space-x-4 text-center mt-4 sm:mt-0">
          <li className="hover:text-[#ffb700]">
            <FontAwesomeIcon icon={faUser} size="lg" />
          </li>
          <li className="hover:text-[#ffb700]">
            <FontAwesomeIcon icon={faHeart} size="lg" />
          </li>
          <li className="hover:text-[#ffb700]">
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;

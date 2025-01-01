import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.png";
import NavBar from "./NavBar";

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
      <NavBar />
    </div>
  );
}

export default Header;

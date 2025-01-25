import React from "react";
import logo from "../assets/logo.png";
import NavBar from "./NavBar";
import SearchBar from "./SearchBar";

function Header() {
  return (
    <div className="relative  sticky top-0 z-50">
      <div className="w-full flex flex-wrap items-center md:justify-between py-2 justify-start sm:space-y-2">
        <img src={logo} alt="Logo" className="w-32 md:w-40" />
        <div className="w-full sm:w-auto mt-4">
          <SearchBar />
        </div>
      </div>

      <hr className="border-t border-gray-300" />
      <NavBar />
    </div>
  );
}

export default Header;

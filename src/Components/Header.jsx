import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import NavBar from "./NavBar";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`relative top-0 z-50 px-5 
        ${isScrolled ? "md:bg-white md:shadow-md" : "md:bg-transparent"} 
        bg-white md:bg-transparent shadow-md md:shadow-none md:sticky
        transition-all duration-300`}
    >
      <div className="w-full flex flex-wrap items-center md:justify-between py-2 justify-start sm:space-y-2">
        <Link to={"/"}>
          <img src={logo} alt="Logo" className="w-32 md:w-40" />
        </Link>
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

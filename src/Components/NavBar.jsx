import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faHeart,
  faUser,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="flex flex-wrap justify-between p-4 relative mb-8">
      {/* Hamburger Icon for Mobile */}
      <div className="block md:hidden relative z-20 -top-28 left-72">
        <FontAwesomeIcon
          icon={menuOpen ? faXmark : faBars}
          size="lg"
          className="text-black cursor-pointer"
          onClick={toggleMenu} 
        />
      </div>

      {/* Navigation Links for Medium & Large Screens */}
      <ul className="hidden md:flex space-x-6 text-m text-center text-black">
        <a href="#">
          <li className="hover:text-[#ffb700]">Home</li>
        </a>
        <a href="#">
          <li className="hover:text-[#ffb700]">Women's</li>
        </a>
        <a href="#">
          <li className="hover:text-[#ffb700]">Store</li>
        </a>
        <a href="#">
          <li className="hover:text-[#ffb700]">About Us</li>
        </a>
        <a href="#">
          <li className="hover:text-[#ffb700]">Contact</li>
        </a>
      </ul>

      {/* Mobile Navigation Menu */}
      <div
        ref={menuRef}
        className={`${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } absolute md:hidden overflow-hidden transition-all duration-700 ease-in-out opacity-90 bg-slate-200 w-72 left-6 z-10`}
      >
        <ul className="flex flex-col space-y-4 p-4 text-black">
          <a href="#">
            <li className="hover:text-[#ffb700]">Home</li>
          </a>
          <a href="#">
            <li className="hover:text-[#ffb700]">Women's</li>
          </a>
          <a href="#">
            <li className="hover:text-[#ffb700]">Store</li>
          </a>
          <a href="#">
            <li className="hover:text-[#ffb700]">About Us</li>
          </a>
          <a href="#">
            <li className="hover:text-[#ffb700]">Contact</li>
          </a>
          <a href="#">
            <li className="hover:text-[#ffb700]">My Account</li>
          </a>
          <a href="#">
            <li className="hover:text-[#ffb700]">My Wishlist</li>
          </a>
          <a href="#">
            <li className="hover:text-[#ffb700]">My Cart</li>
          </a>
        </ul>
      </div>

      {/* Icons for Medium & Large Screens */}
      <ul className="hidden md:flex space-x-4 text-center text-black">
        <a href="#">
          <li className="hover:text-[#ffb700]">
            <FontAwesomeIcon icon={faUser} size="lg" />
          </li>
        </a>
        <a href="#">
          <li className="hover:text-[#ffb700]">
            <FontAwesomeIcon icon={faHeart} size="lg" />
          </li>
        </a>
        <a href="#">
          <li className="hover:text-[#ffb700]">
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          </li>
        </a>
      </ul>
    </nav>
  );
}

export default NavBar;

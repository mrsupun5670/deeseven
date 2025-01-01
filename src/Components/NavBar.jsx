import React, { useState } from "react";
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

  return (
    <nav className="flex flex-wrap justify-between p-4">
      {/* Hamburger Icon for Mobile */}
      <div className="block md:hidden">
        <FontAwesomeIcon
          icon={menuOpen ? faXmark : faBars}
          size="lg"
          className="text-black cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        />
      </div>

      {/* Navigation Links for Medium & Large Screens */}
      <ul className="hidden md:flex space-x-6 text-sm text-center text-black">
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
        className={`${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } md:hidden overflow-hidden bg-opacity-90 transition-all duration-700 ease-in-out`}
      >
        <ul className="flex flex-col space-y-4 text-center mt-4 text-black p-4">
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

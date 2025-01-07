import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faHeart,
  faUser,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import LoginForm from "./LoginForm";
import SignUpFormComponent from "./SignUpFormComponent";
import CartComponent from "./CartComponent";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleSignInClick = () => {
    setIsSignInOpen(true);
    setIsSignUpOpen(false);
  };

  const handleSignUpClick = () => {
    setIsSignUpOpen(true);
    setIsSignInOpen(false);
  };

  const handleClose = () => {
    setIsSignInOpen(false);
    setIsSignUpOpen(false);
  };

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
      <div className="block md:hidden absolute -top-28 right-2">
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
        } absolute flex justify-center text-center md:hidden right-5 overflow-hidden transition-all duration-700 ease-in-out opacity-90 bg-slate-200 left-6 z-10`}
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
        </ul>
      </div>

      {/* Icons for Medium & Large Screens */}
      <ul className="hidden md:flex space-x-4 text-center text-black">
        <button onClick={handleSignInClick}>
          <li className="hover:text-[#ffb700]">
            <FontAwesomeIcon icon={faUser} size="lg" />
          </li>
        </button>

        {/* Rendering the popup logic */}

        {isSignInOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <LoginForm onClose={handleClose} onSignUp={handleSignUpClick} />
          </div>
        )}

        {isSignUpOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <SignUpFormComponent
              onClose={handleClose}
              onsignIn={handleSignInClick}
            />
          </div>
        )}

        <a href="#">
          <li className="hover:text-[#ffb700]">
            <FontAwesomeIcon icon={faHeart} size="lg" />
          </li>
        </a>
        <button onClick={handleCartClick}>
          <li className="hover:text-[#ffb700]">
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          </li>
        </button>

        {isCartOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <CartComponent
              onClose={handleCartClose}
              items={[
                {
                  name: "T-Shirt",
                  price: 20,
                  quantity: 2,
                  image: "https://tshirt.lk/wp-content/uploads/2024/01/Tshirts-300x300.jpg",
                },
                {
                  name: "Jeans",
                  price: 50,
                  quantity: 1,
                  image: "https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/157720305--1--1621961837.jpeg",
                },
              ]}
            />
          </div>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;

import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faUser,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import LoginForm from "./LoginForm";
import SignUpFormComponent from "./SignUpFormComponent";
import CartComponent from "./CartComponent";
import { useNavigate } from "react-router";

function NavBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const popupRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setIsCartOpen(false);
      setIsSignInOpen(false);
      setIsSignUpOpen(false);
    }
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleSignInClick = () => {
    if(localStorage.getItem("userRole") == "customer"){
      var user = JSON.parse(localStorage.getItem("user"));
      navigate('/account')
    } else {
      setIsSignInOpen(true);
      setIsSignUpOpen(false);
    }
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

  useEffect(() => {
      document.addEventListener("mousedown", handleOutsideClick);
      return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

  return (
    <nav className="flex flex-wrap justify-between md:p-4 mt-2 relative md:mb-8">
      {/* Hamburger Icon for Mobile */}
      <div className="block md:hidden absolute -top-24 right-2">
        <FontAwesomeIcon
          icon={menuOpen ? faXmark : faBars}
          size="lg"
          className="text-black cursor-pointer"
          onClick={toggleMenu}
        />
      </div>

      {/* Navigation Links for Medium & Large Screens */}
      <ul className="hidden md:flex space-x-6 text-m text-center text-black">
        <a href="/">
          <li className="hover:text-[#ffb700]">Home</li>
        </a>
        <a href="/men">
          <li className="hover:text-[#ffb700]">Men's</li>
        </a>
        <a href="/women">
          <li className="hover:text-[#ffb700]">Women's</li>
        </a>
        <a href="/store">
            <li className="hover:text-[#ffb700]">Store</li>
          </a>
        <a href="/about_us">
          <li className="hover:text-[#ffb700]">About Us</li>
        </a>
        <a href="/contact_us">
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
          <a href="/">
            <li className="hover:text-[#ffb700]">Home</li>
          </a>
          <a href="/men">
            <li className="hover:text-[#ffb700]">Men's</li>
          </a>
          <a href="/women">
            <li className="hover:text-[#ffb700]">Women's</li>
          </a>
          <a href="/store">
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
        <button onClick={handleCartClick}>
          <li className="hover:text-[#ffb700]">
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />
          </li>
        </button>

        {/* Cart Popup */}
      {isCartOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div ref={popupRef}>
            <CartComponent onClose={() => setIsCartOpen(false)} />
          </div>
        </div>
      )}

      {/* Sign-In Popup */}
      {isSignInOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div ref={popupRef}>
            <LoginForm
              onClose={() => setIsSignInOpen(false)}
              onSignUp={handleSignUpClick}
            />
          </div>
        </div>
      )}

      {/* Sign-Up Popup */}
      {isSignUpOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div ref={popupRef}>
            <SignUpFormComponent
              onClose={() => setIsSignUpOpen(false)}
              onSignIn={() => setIsSignInOpen(true)}
            />
          </div>
        </div>
      )}
      </ul>
    </nav>
  );
}

export default NavBar;

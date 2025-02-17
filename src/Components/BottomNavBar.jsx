import React, { useState, useRef } from "react";
import { Home, Search, ShoppingBag, User } from "lucide-react";
import { Link } from "react-router";
import CartComponent from "./CartComponent";
import SignUpFormComponent from "./SignUpFormComponent";
import LoginForm from "./LoginForm";

const BottomNavBar = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const searchInputRef = useRef(null);

  const popupRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setIsCartOpen(false);
      setIsSignInOpen(false);
      setIsSignUpOpen(false);
    }
  };

  const toggleTab = (tab) => {
    setActiveTab(tab);
    if (tab === "cart") setIsCartOpen(!isCartOpen);
    if (tab === "profile") {
      setIsSignInOpen(!isSignInOpen);
      setIsSignUpOpen(false);
    }
  };

  const handleSignUpClick = () => {
    setIsSignUpOpen(true);
    setIsSignInOpen(false);
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="fixed bottom-3 left-3 right-3 bg-black border-t rounded-lg border-white md:hidden">
      <nav className="flex justify-between items-center px-4 py-2">
        {/* Home Button */}
        <Link
          to="/"
          className={`flex flex-col items-center space-y-1 flex-1 py-2 ${
            activeTab === "home" ? "text-[#ffb700]" : "text-white"
          }`}
          onClick={() => setActiveTab("home")}
        >
          <Home
            className={`w-6 h-6 ${
              activeTab === "home" ? "text-[#ffb700]" : "text-white"
            }`}
          />
          <span className="text-xs">Home</span>
        </Link>

        {/* Search Button */}
        <button
          onClick={() => setActiveTab("search")}
          className={`flex flex-col items-center space-y-1 flex-1 py-2 ${
            activeTab === "search" ? "text-[#ffb700]" : "text-white"
          }`}
        >
          <Search
            className={`w-6 h-6 ${
              activeTab === "search" ? "text-[#ffb700]" : "text-white"
            }`}
          />
          <span className="text-xs">Search</span>
        </button>

        {/* Cart Button */}
        <button
          onClick={() => toggleTab("cart")}
          className={`flex flex-col items-center space-y-1 flex-1 py-2 ${
            activeTab === "cart" ? "text-[#ffb700]" : "text-white"
          }`}
        >
          <ShoppingBag
            className={`w-6 h-6 ${
              activeTab === "cart" ? "text-[#ffb700]" : "text-white"
            }`}
          />
          <span className="text-xs">Cart</span>
        </button>

        {/* Profile Button */}
        <button
          onClick={() => toggleTab("profile")}
          className={`flex flex-col items-center space-y-1 flex-1 py-2 ${
            activeTab === "profile" ? "text-[#ffb700]" : "text-white"
          }`}
        >
          <User
            className={`w-6 h-6 ${
              activeTab === "profile" ? "text-[#ffb700]" : "text-white"
            }`}
          />
          <span className="text-xs">Profile</span>
        </button>
      </nav>

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

      {/* Safe area spacing for iOS devices */}
      <div className="h-safe-bottom bg-white" />
    </div>
  );
};

export default BottomNavBar;

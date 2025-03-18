import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Input from "../Components/Input";
import SocialButton from "../Components/SocialButton";
import model from "../assets/model.webp";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router";

function LoginForm({ onClose, onSignUp }) {
  const APIURL = import.meta.env.VITE_API_URL;

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [userID, setUserID] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    syncSessionCart(userID);
  }, [userID])

  const syncSessionCart = async (id) => {

    const cart = JSON.parse(sessionStorage.getItem("cart"));
    if (cart) {
      try {
        const cartWithID = cart.map((item) => ({...item, emailID: id}))

        await fetch(`${APIURL}/SyncCartItems.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cartWithID)
        });

      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    }
  };

  const loginUser = async (email, password) => {
    const response = await fetch(`${APIURL}/SigninController.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok && response.status == 200) {
      const data = await response.json();

      sessionStorage.setItem("authToken", data.token);

      if (data.response == true && data.role == "customer") {
        sessionStorage.setItem("userRole", "customer");
        sessionStorage.setItem("user", JSON.stringify(data.user));
        setUserID(data.user.id);
        
        // navigate(0);
      } else if (data.response == true && data.role == "admin") {
        sessionStorage.setItem("userRole", "admin");
        sessionStorage.setItem("admin", JSON.stringify(data.user));
        navigate("/admin/dashboard");
      } else {
        alert(data.message);
      }
    }
  };

  const handleSignIn = () => {
    let newErrors = { email: "", password: "" };
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    } else if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      loginUser(email, password);
    }
  };

  return (
    <div className="bg-white rounded-3xl items-center shadow-lg overflow-hidden max-w-4xl w-full flex">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 p-8 relative">
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Form Content */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Sign In</h2>
            <p className="text-gray-600">
              Sign in and enjoy exclusive shoppings.
            </p>
          </div>

          {/* Email & Password Fields */}
          <Input
            type="email"
            placeholder="Email here"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}

          {/* Forgot Password Link */}
          {/* Forgot Password Link */}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or log in with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <SocialButton icon={faFacebook} label="Facebook" />
            <SocialButton icon={faGoogle} label="Google" />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSignIn}
            className="w-full bg-yellow-400 text-black font-medium py-3 rounded-full hover:bg-yellow-500 transition-colors"
          >
            Sign In
          </button>

          {/* Login Link */}
          <p className="flex justify-center gap-1 text-sm text-gray-600">
            New to deezeven. Create your account
            <button
              onClick={onSignUp}
              className="text-[#ffb700] hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-1/2 relative hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30" />
        <img
          src={model}
          alt="Models wearing Deezeven clothing"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export default LoginForm;
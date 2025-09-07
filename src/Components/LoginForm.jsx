import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Input from "../Components/Input";
import SocialButton from "../Components/SocialButton";
import model from "../assets/model.webp";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router";
import HashLoader from "react-spinners/HashLoader";

function LoginForm({ onClose, onSignUp }) {
  const APIURL = import.meta.env.VITE_API_URL;
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();

  const loginUser = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${APIURL}/SigninController.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.response === true) {
        if (data.role === "customer") {
          if (data.user.status !== 0) {
            // Store auth token
            sessionStorage.setItem("authToken", data.token);
            localStorage.setItem("userRole", "customer");
            localStorage.setItem("user", JSON.stringify(data.user));
            // Sync cart if needed
            const cart = JSON.parse(sessionStorage.getItem("cart"));
            if (cart) {
              const cartWithID = cart.map((item) => ({
                ...item,
                emailID: data.user.id,
              }));
              await fetch(`${APIURL}/SyncCartItems.php`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(cartWithID),
              });
            }

            navigate(0);
          } else {
            setErrorMessage(
              "Your account is disabled by the admin! please contact: admin@deezeven.com"
            );
          }
        } else if (data.role === "admin") {
          // Store auth token
          sessionStorage.setItem("authToken", data.token);
          localStorage.setItem("userRole", "admin");
          localStorage.setItem("admin", JSON.stringify(data.user));
          navigate("/admin/dashboard");
        }
      } else {
        // Show error message from backend
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <HashLoader
            color="#FFB700"
            loading={isLoading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
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
              <div>
                <h2 className="text-2xl font-semibold mb-2">Sign In</h2>
                <p className="text-gray-600">
                  Sign in and enjoy exclusive shoppings.
                </p>
              </div>

              {/* Show backend error message */}
              {errorMessage && (
                <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              <Input
                type="email"
                placeholder="Email here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

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
                onClick={loginUser}
                disabled={isLoading}
                className="w-full bg-yellow-400 text-black font-medium py-3 rounded-full hover:bg-yellow-500 transition-colors disabled:opacity-70"
              >
                {isLoading ? "Signing in..." : "Sign In"}
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
      )}
    </div>
  );
}
export default LoginForm;

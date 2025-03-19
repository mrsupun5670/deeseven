import React, { useState } from "react";
import { X } from "lucide-react";
import Input from "../Components/Input";
import SocialButton from "../Components/SocialButton";
import model from "../assets/model.webp";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router";
import HashLoader from "react-spinners/HashLoader";

function SignUpFormComponent({ onClose, onsignIn }) {
  // Hide the API URL
  const APIURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [response, setResponse] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const registerUSer = async (firstName, lastName, email, password) => {
    setLoading(true);
    const response = await fetch(`${APIURL}/SignupController.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const data = await response.json();

    const createdUser = {
      name: firstName + " " + lastName,
      email: email,
      id: data.id,
    };

    if (data.status) {
      setLoading(false);
      sessionStorage.setItem("userRole", "customer");
      sessionStorage.setItem("user", JSON.stringify(createdUser));
      navigate(0);
    }
    setResponse(data);
    setLoading(false);
  };

  const handleRegistration = () => {
    let newErrors = { firstName: "", lastName: "", email: "", password: "" };
    if (!firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);

    if (
      !newErrors.firstName &&
      !newErrors.lastName &&
      !newErrors.email &&
      !newErrors.password
    ) {
      if (isChecked) {
        registerUSer(firstName, lastName, email, password);
      } else {
        setResponse({
          success: false,
          message: "Please accept the terms and conditions",
        });
      }
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <HashLoader
            color="#FFB700"
            loading={loading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="bg-white rounded-3xl items-center shadow-lg overflow-hidden max-w-4xl w-full flex">
          <div className="w-1/2 relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-black/30" />
            <img
              src={model}
              alt="Models wearing Deezeven clothing"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side - Form */}
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
                <h2 className="text-2xl font-semibold mb-2">Sign Up</h2>
                <p className="text-gray-600">
                  Sign up to create an account and enjoy exclusive shoppings.
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm">
                    {errors.firstName}
                  </span>
                )}
                <Input
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.firstName && (
                  <span className="text-red-500 text-sm">
                    {errors.firstName}
                  </span>
                )}
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
              
              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer group">
                <div className="mt-1">
                  <Input
                    type="checkbox"
                    className="w-4 h-4 border-2 border-yellow-400 rounded-sm group-hover:border-yellow-500 transition-colors"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                </div>
                <p className="text-sm text-gray-600 text-start">
                  By creating account you agree to accept our{" "}
                  <a href="#" className="text-[#ffb700] hover:underline">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#ffb700] hover:underline">
                    Terms of Services
                  </a>
                  .
                </p>
              </label>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or Sign up with
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
                onClick={handleRegistration}
                className="w-full bg-[#ffb700] text-black font-medium py-3 rounded-full hover:bg-yellow-500 transition-colors"
              >
                Create Account
              </button>

              {/* Login Link */}
              <p className="flex justify-center gap-1 text-sm text-gray-600">
                Already have an account?
                <button
                  onClick={onsignIn}
                  className="text-[#ffb700] hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignUpFormComponent;

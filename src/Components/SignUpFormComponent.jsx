import React, { useState } from "react";
import { X } from "lucide-react";
import Input from "../Components/Input";
import model from "../assets/model.webp";
import { useNavigate } from "react-router";
import HashLoader from "react-spinners/HashLoader";

function SignUpFormComponent({ onClose, onsignIn }) {
  const APIURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const registerUser = async () => {
    if (!isChecked) {
      setErrorMessage("Please accept the terms and conditions");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(`${APIURL}/SignupController.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      try {
        const data = await response.json();

        const insertedUser = {
          name: firstName + " " + lastName,
          email,
          id: data.id,
        }
        if (data.status) {
          setLoading(false);
          localStorage.setItem("userRole", "customer");
          localStorage.setItem("user", JSON.stringify(insertedUser));

          //Sync cart if needed
          const cart = JSON.parse(sessionStorage.getItem("cart"));
          if (cart) {
            const cartWithID = cart.map((item) => ({
              ...item,
              emailID: data.id,
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
          setErrorMessage(data.message || "Registration failed");
        }
      } catch (e) {
        setErrorMessage("Server returned invalid response");
        setLoading(false);
        return;
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <HashLoader
          color="#FFB700"
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-4xl w-full flex">
      {/* Left side - Image */}
      <div className="w-1/2 relative hidden md:block">
        <img src={model} alt="Model" className="w-full h-full object-cover" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 p-8 relative">
        <button
          className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100"
          onClick={onClose}
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Sign Up</h2>
          <p className="text-gray-600">Create an account to start shopping</p>

          {errorMessage && (
            <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          {/* Form fields */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              className="mt-1"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <p className="text-sm text-gray-600">
              I agree to the Terms and Privacy Policy
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={registerUser}
            className="w-full bg-yellow-400 text-black font-medium py-3 rounded-full hover:bg-yellow-500"
          >
            Create Account
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={onsignIn}
              className="text-yellow-500 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpFormComponent;

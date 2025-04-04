import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  if (localStorage.getItem("user") === null) {
    alert("Unautherized access!");
    sessionStorage.clear();
    window.location.href = "/";
  }

  const goToHome = () => {
    navigate("/");
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <img src={logo} alt="Logo" className="w-32 md:w-40 mb-8" />

        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-green-500 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-700 mb-6">
            Thank you for your purchase. Your payment has been processed
            successfully.
          </p>

          <button
            onClick={goToHome}
            className="bg-black text-white font-bold p-3 hover:bg-gray-800 rounded-full w-full mt-4"
          >
            Go to Home
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

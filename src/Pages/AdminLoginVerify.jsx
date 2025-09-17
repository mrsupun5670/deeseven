import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

const AdminLoginVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const adminData = searchParams.get("admin");

    if (token && adminData) {
      try {
        // Parse admin data
        const admin = JSON.parse(decodeURIComponent(adminData));
        
        // Store admin session data
        sessionStorage.setItem("authToken", token);
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("admin", JSON.stringify(admin));
        
        setLoading(false);
        
        // Redirect to admin dashboard
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 1500);
        
      } catch (error) {
        console.error("Error processing admin login:", error);
        setError("Invalid login data. Please try logging in again.");
        setLoading(false);
      }
    } else {
      setError("Missing verification parameters. Please try logging in again.");
      setLoading(false);
    }
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <HashLoader
            color="#FFB700"
            loading={loading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            Verifying Admin Login...
          </h2>
          <p className="mt-2 text-gray-600">
            Please wait while we set up your admin session.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-6 py-2 rounded-full transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-green-500 text-5xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Login Successful!
        </h2>
        <p className="text-gray-600 mb-4">
          Welcome, Admin! Redirecting to dashboard...
        </p>
        <div className="text-yellow-500">
          <HashLoader
            color="#FFB700"
            loading={true}
            size={30}
            aria-label="Loading Spinner"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminLoginVerify;
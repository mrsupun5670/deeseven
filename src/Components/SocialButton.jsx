import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, facebookProvider, provider } from "../firebase";
import { useNavigate } from "react-router";

const SocialButton = ({ icon, label }) => {
  const APIURL = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      const userData = {
        email: user.email,
        name: user.displayName,
        profilePicture: user.photoURL,
        token: token,
      };
      const response = await fetch(`${APIURL}/SocialSigninController.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.response === true) {
        sessionStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", "customer");
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate(0);
      }
    } catch (error) {
      console.error("Google Login Error:", error); // 👈 log it
      console.log("Error code:", error.code);

      if (error.code === "auth/account-exists-with-different-credential") {
        alert(
          "This email is already registered with another login method.\n\nPlease try logging in with Facebook instead."
        );
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      const userData = {
        email: user.email,
        name: user.displayName,
        profilePicture: user.photoURL,
        token: token,
      };

      const response = await fetch(`${APIURL}/SocialSigninController.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.response === true) {
        sessionStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", "customer");
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate(0);
      } else {
        console.error("Backend error:", data.message);
      }
    } catch (error) {
      console.error("Facebook Login Error:", error); // 👈 log the actual error object
      console.log("Error code:", error.code);

      if (error.code === "auth/account-exists-with-different-credential") {
        alert(
          "This email is already registered with another login method.\n\nPlease try logging in with Google instead."
        );
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

  return (
    <button className="flex items-center justify-center gap-2 px-2 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
      <FontAwesomeIcon icon={icon} />
      {label === "Google" ? (
        <span onClick={handleGoogleLogin} className="text-sm text-gray-700">
          Login with Google
        </span>
      ) : (
        <span onClick={handleFacebookLogin} className="text-sm text-gray-700">
          Login with Facebook
        </span>
      )}
    </button>
  );
};

export default SocialButton;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react'
import { auth, facebookProvider, provider } from '../firebase';
import { useNavigate } from 'react-router';


const SocialButton = ({ icon, label }) => {

  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try{
      const result = await signInWithPopup(auth, provider);
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      const userData = {
        email: user.email,
        name: user.displayName,
        profilePicture: user.photoURL,
        token: token
      };
      console.log('User data:', userData); 
      if(userData) {
        sessionStorage.setItem("authToken", userData.token);
            localStorage.setItem("userRole", "customer");
            localStorage.setItem("user", JSON.stringify(userData));
            navigate(0);
      }

    } catch(error) {
      console.error('Error:', error);
    }
  };

  const handleFacebookLogin = async () => {
    const result = await signInWithPopup(auth, facebookProvider);
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    const userData = {
      email: user.email,
      name: user.displayName,
      profilePicture: user.photoURL,
      token: token
    };
    console.log('User data:', userData);
    if(userData) {
      sessionStorage.setItem("authToken", userData.token);
            localStorage.setItem("userRole", "customer");
            localStorage.setItem("user", JSON.stringify(userData));
            navigate(0);
    }
  };

  return (
    <button className="flex items-center justify-center gap-2 px-2 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors">
      <FontAwesomeIcon icon={icon} />
      {label === 'Google' ? (
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
}
  
export default SocialButton
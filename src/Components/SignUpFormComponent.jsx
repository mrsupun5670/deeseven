import React from 'react'
import { X } from 'lucide-react';
import Input from '../Components/Input';
import SocialButton from '../Components/SocialButton';
import logo from "../assets/logo.png";
import model from "../assets/model.webp";
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router';

function SignUpFormComponent() {
  return (
    <div className="min-h-screen bg-[#ffb700] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden max-w-4xl w-full flex">
        {/* Left Side - Image */}
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
          >
            <Link to="/">
              <X className="w-5 h-5 text-gray-500" />
            </Link>
          </button>

          {/* Logo */}
          <div className="mb-8">
            <img 
              src={logo}
              alt="Deezeven Logo"
              className="h-8"
            />
          </div>

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
              <Input placeholder="First name" />
              <Input placeholder="Last name" />
            </div>

            {/* Email & Password Fields */}
            <Input type="email" placeholder="Email here" />
            <Input type="password" placeholder="Password" />

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2 cursor-pointer group">
              <div className="mt-1">
                <Input type='checkbox' className="w-4 h-4 border-2 border-yellow-400 rounded-sm group-hover:border-yellow-500 transition-colors" />
              </div>
              <p className="text-sm text-gray-600">
                By creating account you agree to accept our{' '}
                <a href="#" className="text-[#ffb700] hover:underline">Privacy Policy</a>
                {' '}and{' '}
                <a href="#" className="text-[#ffb700] hover:underline">Terms of Services</a>.
              </p>
            </label>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or Sign up with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <SocialButton icon={faFacebook} label="Facebook" />
              <SocialButton icon={faGoogle} label="Google" />
            </div>

            {/* Submit Button */}
            <button className="w-full bg-[#ffb700] text-black font-medium py-3 rounded-full hover:bg-yellow-500 transition-colors">
              Create Account
            </button>

            {/* Login Link */}
            <p className="flex justify-center gap-1 text-gray-600">
              Already have an account?
              <p className="text-[#ffb700] hover:underline">
                <Link to="/signin">Sign in</Link>
              </p>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpFormComponent
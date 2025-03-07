import FeatureCard from "../Components/FeatureCard";
import ProductSection from "../Components/ProductSection";
import "../global.css";
import { faShieldAlt } from "@fortawesome/free-solid-svg-icons/faShieldAlt";
import { faLockOpen } from "@fortawesome/free-solid-svg-icons/faLockOpen";
import { faTruckArrowRight } from "@fortawesome/free-solid-svg-icons/faTruckArrowRight";
import Header from "../Components/Header";
import Hero from "../Components/Hero";
import MobileCarousal from "../Components/MobileCarousal";
import BottomNavBar from "../Components/BottomNavBar";

export default function MyAccount() {
  return (
    <div className="bg-gray-200 min-h-screen relative">
      <div className="relative p-5 z-0">
        <Header />
       
        <div className="w-full md:w-100 mx-auto flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8 py-8 px-4">
         
        </div>
       
      </div>
      <BottomNavBar />
    </div>
  );
}

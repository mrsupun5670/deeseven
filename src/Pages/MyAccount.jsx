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
    <div className="bg-gray-200 min-h-screen relative flex justify-center">
      <div className="w-full max-w-[1280px]">
        <div className="relative p-5 z-0">
          <Header />

          <div className="flex flex-row ">
            <p className=" font-bold text-3xl">My Account - Orders</p>
          </div>
        </div>
        <BottomNavBar />
      </div>
    </div>
  );
}

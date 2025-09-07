import FeatureCard from "../Components/FeatureCard";
import ProductSection from "../Components/ProductSection";
import "../global.css";
import { faShieldAlt } from "@fortawesome/free-solid-svg-icons/faShieldAlt";
import { faLockOpen } from "@fortawesome/free-solid-svg-icons/faLockOpen";
import { faTruckArrowRight } from "@fortawesome/free-solid-svg-icons/faTruckArrowRight";
import Header from "../Components/Header";
import Hero from "../Components/Hero";
import Carasoul from "../Components/Carasoul";
import MobileCarousal from "../Components/MobileCarousal";

export default function Index() {
  return (
    <div className="bg-gray-200 min-h-screen relative">
      <div className="relative p-5 z-0">
        <Header />
        <Hero />
        <MobileCarousal />
        <div className="w-full md:w-100 mx-auto flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8 py-8 px-4">
          <FeatureCard
            title="Free Delivery"
            text="Enjoy Fast Free Delivery On Every Order With Reliable Shipping Guaranteed."
            icon={faTruckArrowRight}
          />
          <FeatureCard
            title="Secure Payment"
            text="Secure Payment Ensures Encrypted, authenticated transactions."
            icon={faLockOpen}
          />
          <FeatureCard
            title="Quality Guarantee"
            text="We Provide High Quality Products With Satisfaction Guaranteed."
            icon={faShieldAlt}
          />
        </div>
        <ProductSection title="New Arrivals" />
        <ProductSection title="Men's Collection" />
        <ProductSection title="Women's Collection" />
      </div>
    </div>
  );
}

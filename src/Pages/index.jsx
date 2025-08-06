import ProductSection from "../Components/ProductSection";
import "../global.css";
import Header from "../Components/Header";
import Hero from "../Components/Hero";
import MobileCarousal from "../Components/MobileCarousal";
import BottomNavBar from "../Components/BottomNavBar";
import Footer from "../Components/Footer";

export default function Index() {
  return (
    <>
    <div className="bg-gray-200 min-h-screen relative">
      <div className="relative z-0">
        <Header />
        <Hero />
        <div className="block md:hidden overflow-hidden -mt-9">
          <MobileCarousal />
        </div>
      <div className="mb-4"></div>
        <ProductSection title="New Arrivals" />
        <ProductSection title="Men's Collection" />
        <ProductSection title="Women's Collection" />
      </div>
      <BottomNavBar />
    </div>
    <Footer />
    </>
  );
}

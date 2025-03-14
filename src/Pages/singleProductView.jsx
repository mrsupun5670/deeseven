import React from "react";
import SingleProduct from "../Components/SingleProduct";
import BottomNavBar from "../Components/BottomNavBar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";

function SingleProductPage() {
  return (
    <div className="font-sans">
      <Header />
      <main className="px-8 py-4">
        <SingleProduct  />
      </main>
      <br />
      <BottomNavBar />
      <Footer />
    </div>
  );
}

export default SingleProductPage;

import React from "react";
import Header from "./components/Header";
import ProductDetails from "./components/SingleProduct";
import MoreDesigns from "./components/SimilarProducts";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="font-sans">
      {/* <Header /> */}
      <main className="px-8 py-4">
        <SingleProduct />
        <SimilarProducts />
      </main>
      <Footer />
    </div>
  );
}

export default App;

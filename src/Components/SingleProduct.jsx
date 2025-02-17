import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
// import { Link } from "react-router-dom";

import main1 from "../assets/main1.jpg";
import main2 from "../assets/main2.jpg";
import main3 from "../assets/main3.jpg";
import { Scrollbar } from "swiper/modules";
import { useState } from "react";
// import Breadcrumb from "./Breadcrumb";

export default function SingleProduct() {
  const [mainImage, setMainImage] = useState(main1);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  const images = [main1, main2, main3];

  const handleImageClick = (image) => {
    if (image !== mainImage) {
      setMainImage(image);
    }
  };

  const handleIncrease = () => {
    setQty(qty + 1);
  };

  const handleDecrease = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  //   const breadcrumbPaths = [
  //     { name: "Gents", link: "/Gents" },
  //     { name: "Crew Neck T-Shirt", link: "/CrewNeckTshirt" },
  //   ];
  return (
    <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="hidden md:flex md:col-span-1 flex-col space-y-4">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className={`w-20 h-20 object-cover cursor-pointer border rounded-md ${
                mainImage === image ? "border-gray-400" : "border-gray-200"
              } hover:border-gray-400`}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>

        <div className="flex md:hidden overflow-x-auto space-x-4 scrollbar-hide">
          <Swiper
            scrollbar={{
              hide: false,
            }}
            modules={[Scrollbar]}
            className="w-full h-full"
          >
            <SwiperSlide>
              <img
                src={main1}
                alt="Slide 1"
                className="w-full h-auto object-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src={main2}
                alt="Slide 2"
                className="w-full h-auto object-cover"
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                src={main3}
                alt="Slide 3"
                className="w-full h-auto object-cover"
              />
            </SwiperSlide>
          </Swiper>
        </div>

        <div className="hidden md:flex md:col-span-3 flex justify-center">
          <img
            src={mainImage}
            alt="Product"
            className="w-full h-auto object-contain border border-gray-200 rounded-md"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center space-x-2 text-sm mb-3 text-gray-600">
          <span className="hover:text-black">
            Home / Shop / Crew Neck T-Shirt
          </span>
        </nav>

        {/* Product Title and Price */}
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-start">
          Comfort Fit Crew Neck T-shirt – Light Peach
        </h1>
        <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-start">
          Rs.990.00
        </p>

        {/* Product Description */}
        <p className="text-gray-600 mb-6 text-start">
          Snazzy and Hip! Cool to the Core! Fashionable and Funky! Moose Crew
          Neck T-shirts are out, a wide variety of your favourite colors to
          choose from for all your casual needs!
        </p>

        {/* Grid Section for Fabric Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-bold mb-2 text-start">
              About the fabric
            </h2>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Fabric composition: Polyester mixed cotton</li>
              <li>Fabric pattern: Solid</li>
              <li>Fit type: Comfort Fit</li>
              <li>Length: Regular</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2 text-start">Fabric Care</h2>
            <p className="text-gray-600 text-start ">Machine wash</p>
          </div>
        </div>

        {/* Grid Section for Add-on Features and Note */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-bold mb-2 text-start">
              Add-on Features
            </h2>
            <ul className="list-disc pl-5 text-gray-600">
              <li>Comfortable</li>
              <li>Great fit on</li>
              <li>Authentic branding</li>
              <li>
                Care instructions on the satin care label for machine wash
                directions
              </li>
              <li>Comfortable heat seals</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2 text-start">Note</h2>
            <p className="text-gray-600 text-start">
              The item may slightly vary from the displayed image in terms of
              color due to lighting conditions or the display used to view, and
              the fabric material from color to color and size to size.
            </p>
          </div>
        </div>

        {/* Size, Quantity, and Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="w-full sm:w-auto">
            <label
              htmlFor="size"
              className="block text-lg font-bold mb-2 text-start"
            >
              SIZE:
            </label>
            <div className="flex justify-start gap-2">
              {["Xs", "S", "M", "L"].map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeClick(size)}
                  className={`border rounded-lg px-4 py-2 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 ${
                    selectedSize === size
                      ? "bg-gray-400 text-white"
                      : "bg-white"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full gap-2 flex items-center">
            <button
              className="border rounded-lg px-4 py-2 hover:bg-gray-200"
              onClick={handleDecrease}
            >
              -
            </button>
            <span className="text-lg font-bold">{qty}</span>
            <button
              className="border rounded-lg px-4 py-2 hover:bg-gray-200"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>

          <div className="w-full flex gap-4">
            <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 w-full sm:w-auto">
              ADD TO CART
            </button>
            <button className="text-black px-6 py-2 rounded-lg hover:bg-neutral-400 hover:border-black border w-full sm:w-auto">
              Size Guide
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

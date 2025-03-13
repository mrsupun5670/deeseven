import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CategoryCard({ image, title, qty }) {


  return (
    <div className="w-full md:w-full rounded-md shadow-lg overflow-hidden  border border-gray-200">
      <img src={image} alt={title} className="w-full h-full object-cover rounded" />

      <div className="flex flex-col items-start p-2 md:p-4 mb-4">
        <h3 className=" text-md md:text-lg font-semibold text-gray-800">
          {title}
        </h3>
        <h4 className="mt-1 text-md md:text-lg text-gray-800">{qty} items</h4>
      
      </div>
    </div>
  );
}

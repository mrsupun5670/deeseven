import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ image, title, onAddToCart, onWishlist, price }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="w-full md:w-full rounded-md shadow-lg overflow-hidden  border border-gray-200">
      <img src={image} alt={title} className="w-full object-cover rounded" />

      <div className="flex flex-col items-start p-2 md:p-4 mb-4">
        <h3 className=" text-sm md:text-lg font-semibold text-gray-800">
          {title}
        </h3>
        <h4 className="mt-1 text-md md:text-lg text-gray-800">Rs.{price}.00</h4>
        <div className="flex gap-4 mt-1">
          <span
            onClick={onAddToCart}
            className="flex items-center gap-1 text-blue-500 cursor-pointer hover:text-blue-600 transition font-bold"
          >
            <ShoppingCart size={18} />
            <span className="hidden md:block">Add to Cart</span>
          </span>
          <button
            onClick={toggleWishlist}
            className={`text-gray-500 hover:text-red-500 ${
              isWishlisted ? "text-red-500" : "text-gray-500"
            }`}
          >
            <Heart size={18} fill={isWishlisted ? "red" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}

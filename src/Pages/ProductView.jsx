import React from "react";
import image from "../assets/image.jpg";
import { useState } from "react";
import ProductCard from "../Components/ProductCard";

function ProductView({category}) {

  const items = [
    { title: "T-Shirt", qty: "25", image: "https://via.placeholder.com/150" },
    { title: "Jeans", qty: "15", image: "https://via.placeholder.com/150" },
    { title: "Jacket", qty: "10", image: "https://via.placeholder.com/150" },
    { title: "Shoes", qty: "20", image: "https://via.placeholder.com/150" },
    { title: "Sweater", qty: "18", image: "https://via.placeholder.com/150" },
    { title: "Hoodie", qty: "12", image: "https://via.placeholder.com/150" },
    { title: "Shorts", qty: "22", image: "https://via.placeholder.com/150" },
    { title: "Cap", qty: "30", image: "https://via.placeholder.com/150" },
    { title: "Socks", qty: "40", image: "https://via.placeholder.com/150" },
    { title: "Gloves", qty: "8", image: "https://via.placeholder.com/150" },
    { title: "T-Shirt", qty: "25", image: "https://via.placeholder.com/150" },
    { title: "Jeans", qty: "15", image: "https://via.placeholder.com/150" },
    { title: "Jacket", qty: "10", image: "https://via.placeholder.com/150" },
    { title: "Shoes", qty: "20", image: "https://via.placeholder.com/150" },
    { title: "Sweater", qty: "18", image: "https://via.placeholder.com/150" },
    { title: "Hoodie", qty: "12", image: "https://via.placeholder.com/150" },
    { title: "Shorts", qty: "22", image: "https://via.placeholder.com/150" },
    { title: "Cap", qty: "30", image: "https://via.placeholder.com/150" },
    { title: "Socks", qty: "40", image: "https://via.placeholder.com/150" },
    { title: "Gloves", qty: "8", image: "https://via.placeholder.com/150" },
    { title: "T-Shirt", qty: "25", image: "https://via.placeholder.com/150" },
    { title: "Jeans", qty: "15", image: "https://via.placeholder.com/150" },
    { title: "Jacket", qty: "10", image: "https://via.placeholder.com/150" },
    { title: "Shoes", qty: "20", image: "https://via.placeholder.com/150" },
    { title: "Sweater", qty: "18", image: "https://via.placeholder.com/150" },
    { title: "Hoodie", qty: "12", image: "https://via.placeholder.com/150" },
    { title: "Shorts", qty: "22", image: "https://via.placeholder.com/150" },
    { title: "Cap", qty: "30", image: "https://via.placeholder.com/150" },
    { title: "Socks", qty: "40", image: "https://via.placeholder.com/150" },
    { title: "Gloves", qty: "8", image: "https://via.placeholder.com/150" }
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="p-8  flex flex-col">
      <div className=" mb-10">
        <p className=" font-bold text-6xl">{category}</p>
      </div>
      <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
      {currentItems.map((item, index) => (
          <ProductCard key={index} title={item.title} price={item.qty} image={image} />
        ))}
      </div>

      <div className="mt-8 flex justify-center items-center gap-2">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded-md border transition ${
              currentPage === index + 1
                ? "bg-gray-300 text-gray-700 font-bold" 
                : "bg-white border-gray-300 hover:bg-blue-500 hover:text-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductView;

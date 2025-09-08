import React, { useEffect } from "react";
import { useState } from "react";
import Header from "../Components/Header";
import BottomNavBar from "../Components/BottomNavBar";
import Footer from "../Components/Footer";
import HashLoader from "react-spinners/HashLoader";
import { Link, useLocation } from "react-router";

function CategoryView({ title }) {
  const APIURL = import.meta.env.VITE_API_URL;

  const loaction = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  let location = loaction.pathname;

  let formattedLocation = location.substring(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${APIURL}/ViewProductsOnCategory.php?category=${formattedLocation}`
        );
        const data = await response.json();
        setLoading(true);
        if (data.status) {
          setProducts(data.data);
        } else {
          setLoading(false);
        }
      } catch (error) {
        return [];
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <>
      <Header />
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <HashLoader
            color="#FFB700"
            loading={loading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="px-4 md:px-8 md:mt-8 flex flex-col max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="font-bold text-4xl md:text-6xl tracking-tight">
              {title}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {currentItems.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden bg-white rounded-lg shadow-sm transition duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                {/* Image wrapper with aspect ratio */}
                <Link to={`/product/${item.product_id}`} key={item.product_id}>
                  <div className="relative pb-[125%] overflow-hidden">
                    {console.log()}
                    <img
                      src={`${APIURL}/${
                        item?.images?.[0]?.image_url || "images/placeholder.jpg"
                      }`}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-contain transition duration-500 group-hover:scale-105"
                    />

                    {/* Quick view button */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                      <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                        Quick View
                      </button>
                    </div>
                  </div>
                </Link>

                {/* Product info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 truncate">
                    {item.title}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 font-semibold">
                      Rs.{item.price?.toFixed(2) || "Price unavailable"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.product_status == 1 ? "Available" : "Not Available"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex justify-center items-center gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded-md border transition-all duration-300 ${
                  currentPage === index + 1
                    ? "bg-gray-800 text-white font-medium"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
      <BottomNavBar />
      <Footer />
    </>
  );
}

export default CategoryView;

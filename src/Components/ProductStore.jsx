import { useEffect, useState } from "react";
import { Link } from "react-router";
import HashLoader from "react-spinners/HashLoader";

const ProductStore = ({ searchQuery = "" }) => {
  const APIURL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParam = searchQuery
          ? `?search=${encodeURIComponent(searchQuery)}`
          : "";
        const response = await fetch(
          `${APIURL}/ViewProductsController.php${queryParam}`
        );
        const data = await response.json();
        if (data.status) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category_name === selectedCategory;
    return matchesCategory;
  });

  return (
    <div className="container mx-auto p-4">
      {/* Sorting Dropdown */}
      <div className="flex justify-end mb-4">
        <select
          className="p-2 border rounded-md w-full md:w-[200px] shadow-sm text-gray-700"
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
        >
          <option value="all">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Unisex">Unisex</option>
        </select>
      </div>

      {/* Product Grid */}
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
      ) : filteredProducts.length === 0 ? (
        <div className="flex justify-center items-center h-40 text-center text-gray-500 text-lg">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.product_id}
              className="bg-white shadow-md rounded-lg overflow-hidden p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="relative w-full h-[200px] md:h-[400px] flex justify-center items-center bg-gray-100 group">
                <div className="relative w-full h-[200px] md:h-[400px] flex justify-center items-center bg-gray-100 group">
                  <img
                    src={product.images.length > 0 ? product.images[0].image_url : ""}
                    alt={product.title}
                    className={`object-cover h-full w-full ${
                      product.product_status === 0 ? "opacity-50" : ""
                    }`}
                  />
                  {/* "Out of Stock" Overlay */}
                  {product.product_status === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                      <span className="text-white text-lg font-bold bg-red-600 px-4 py-2 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick View Button (Visible on Hover) */}
                <Link to={`/product/${product.product_id}`}>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                      Quick View
                    </button>
                  </div>
                </Link>
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-lg font-bold">{product.title}</h2>
                <p className="text-gray-700 font-semibold">
                  Rs. {product.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductStore;

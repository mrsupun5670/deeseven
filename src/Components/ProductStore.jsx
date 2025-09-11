import { Key } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

const ProductStore = ({ searchQuery = "" }) => {
  const APIURL = import.meta.env.VITE_API_URL;
  const PRODUCTS_PER_PAGE = 8; // Same as backend limit

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchProducts = async (pageNumber = 1, isLoadMore = false) => {
    if (!hasMore) return; // Stop fetching if no more products

    isLoadMore ? setLoadingMore(true) : setLoading(true);

    try {
      const queryParam = `?page=${pageNumber}&search=${encodeURIComponent(
        searchQuery
      )}`;
      const response = await fetch(
        `${APIURL}/ViewProductsController.php${queryParam}`
      );
      const data = await response.json();

      if (data.status) {
        setProducts((prevProducts) => [...prevProducts, ...data.data]);

        // If fetched products are less than PRODUCTS_PER_PAGE, stop fetching
        if (data.data.length < PRODUCTS_PER_PAGE) {
          setHasMore(false);
        }
      } else {
        setHasMore(false); // In case of error, prevent infinite fetching
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setHasMore(false);
    } finally {
      isLoadMore ? setLoadingMore(false) : setLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1);
  }, [searchQuery]);

  const observer = useRef();
  const lastProductRef = useCallback(
    (node) => {
      if (loadingMore || !hasMore) return; // Prevent unnecessary observer triggers

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  useEffect(() => {
    if (page > 1) {
      fetchProducts(page, true);
    }
  }, [page]);

  const filteredProducts = products.filter(
    (product) =>
      selectedCategory === "all" || product.category_name === selectedCategory
  );

  return (
    <div className="container mx-auto p-4">
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

      {loading && products.length === 0 ? (
        <div className="flex justify-center items-center h-40">
          <HashLoader color="#FFB700" size={50} />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex justify-center items-center h-40 text-center text-gray-500 text-lg">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <Link key={index} to={`/product/${product.product_id}`}>
              <div
                key={product.product_id}
                ref={
                  index === filteredProducts.length - 1 ? lastProductRef : null
                }
                className="bg-white shadow-md rounded-lg overflow-hidden p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="relative w-full h-[200px] md:h-[400px] flex justify-center items-center bg-gray-100 group">
                  <img
                    src={
                      product.images.length > 0
                        ? `${APIURL}/${product.images[0].image_url}`
                        : ""
                    }
                    alt={product.title}
                    className={`object-contain h-full w-full ${
                      product.product_status === 0 ? "opacity-50" : ""
                    }`}
                  />

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                      Quick View
                    </button>
                  </div>
                  {/* {product.product_status === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                      <span className="text-white text-sm md:text-lg font-bold bg-red-600 px-2 py-1 md:px-4 md:py-2 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )} */}
                </div>

                <div className="mt-4 text-center">
                  <h2 className="text-lg font-bold">{product.title}</h2>
                  <p className="text-gray-700 font-semibold">
                    Rs. {product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Show spinner only if there are more products to load */}
      {loadingMore && hasMore && (
        <div className="flex justify-center mt-4">
          <HashLoader color="#FFB700" size={30} />
        </div>
      )}
    </div>
  );
};

export default ProductStore;

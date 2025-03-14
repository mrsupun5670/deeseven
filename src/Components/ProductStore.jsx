import { useEffect, useState } from "react";
import { Link } from "react-router";
import HashLoader from "react-spinners/HashLoader";

const ProductStore = () => {
  const APIURL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${APIURL}/ViewProductsController.php`);
        const data = await response.json();
        console.log(data.data);
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

  const filterCategories = products.filter((product) => {
    if (selectedCategory === "all") return product;
    if (selectedCategory === "men") return product.category_name === "men";
    if (selectedCategory === "women") return product.category_name === "women";
    if (selectedCategory === "unisex")
      return product.category_name === "unisex";
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
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="unisex">Unisex</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="flex justify-center items-center h-40 w-full">
            <HashLoader
              color="#FFB700"
              loading={loading}
              size={50}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : filterCategories.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-6">
            No products found in this category.
          </div>
        ) : (
          filterCategories.map((product) => (
            <div
              key={product.product_id}
              className="bg-white shadow-md rounded-lg overflow-hidden p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="relative w-full h-[200px] md:h-[400px] flex justify-center items-center bg-gray-100 group">
                <img
                  src={product.images[0].image_url}
                  alt={product.title}
                  className="object-cover h-full w-full"
                />
                {/* Quick View Button (Visible on Hover) */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Link to={`/product/${product.product_id}`}>
                    <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                      Quick View
                    </button>
                  </Link>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-lg font-bold">{product.title}</h2>
                <p className="text-gray-700 font-semibold">
                  Rs. {product.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductStore;

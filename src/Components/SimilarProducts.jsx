import { useState, useEffect } from "react";
import { Link } from "react-router";
import HashLoader from "react-spinners/HashLoader";

const SimilarProducts = ({ subCategory, productId }) => {
  const APIURL = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      fetchProducts();
    }, 2000);
  }, [subCategory, productId]);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${APIURL}/LoadSimillerProducts.php?id=${productId}&subCategory=${encodeURIComponent(
          subCategory
        )}`
      );
      const data = await response.json();

      if (data.status) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching similar products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto mt-12">
      <h3 className="text-xl font-bold mb-6">You May Also Like</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {loading ? (
          <HashLoader
            color="#FFB700"
            loading={loading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        ) : products.length > 0 ? (
          products.map((product) => (
            <Link
              to={`/product/${product.product_id}`}
              key={product.product_id}
            >
              <div
                key={product.product_id}
                className="bg-white border rounded-md overflow-hidden shadow-sm"
              >
                <img
                  src={product.images.length > 0 ? `${APIURL}/${product.images[0].image_url}` : ""}
                  alt={product.product_name}
                  className="w-full h-auto"
                />
                <div className="p-4">
                  <p className="font-bold">{product.product_name}</p>
                  <p className="text-gray-500">
                    Rs. {product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">No similar products found.</p>
        )}
      </div>
    </section>
  );
};

export default SimilarProducts;

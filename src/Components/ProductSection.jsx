import { useEffect, useState } from "react";
import { Link } from "react-router";
import HashLoader from "react-spinners/HashLoader";

export default function ProductSection({ title }) {
  const APIURL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${APIURL}/ViewProductsController.php`);
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

  const filterProducts = products.filter((product) => {
    if (title === "New Arrivals") return product.date_added;
    if (title === "Men's Collection") return product.category_name == "men";
    if (title === "Women's Collection") return product.category_name == "women";
  });

  return (
    <section className="container mx-auto px-10 text-center pb-8">
      <h3 className="text-xl sm:text-2xl font-semibold mb-4">{title}</h3>
      <div className="relative">
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
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide p-2 md:p-4 gap-3 md:gap-6">
            {filterProducts.map((product) => (
              <Link
                to={`/product/${product.product_id}`}
                key={product.product_id}
                className="group flex-shrink-0 w-[180px] h-[225px] sm:w-[220px] sm:h-[280px] md:w-[280px] md:h-[350px] rounded-xl shadow-md bg-white border border-gray-100 overflow-hidden transition duration-300 hover:shadow-xl hover:scale-[1.02] snap-start"
              >
                <div className="relative w-full h-full">
                  {/* Product Image - Full size */}
                  <img
                    src={
                      product.images[0]?.image_url || "/images/placeholder.jpg"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Hover Overlay with Title */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                    <p className="text-white text-center text-sm sm:text-lg font-semibold px-4">
                      {product.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <button
        className="mt-6 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        style={{ cursor: "pointer !important" }}
      >
        View More
      </button>
    </section>
  );
}

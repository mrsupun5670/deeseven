import { useEffect, useState } from "react";
import { Link } from "react-router";
import HashLoader from "react-spinners/HashLoader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
    if (title === "Men's Collection") return product.category_name == "Men";
    if (title === "Women's Collection") return product.category_name == "Women";
  });

  let path = "";

  if (title === "New Arrivals") path = "store";
  if (title === "Men's Collection") path = "men";
  if (title === "Women's Collection") path = "women";

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
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation
            autoplay={{ delay: 3000, disableOnInteraction: false }} 
            spaceBetween={20}
            slidesPerView={2} 
            breakpoints={{
              640: { slidesPerView: 2 }, 
              1024: { slidesPerView: 4 }, 
            }}
            className="w-full"
          >
            {filterProducts.slice(0, 10).map((product) => (
              <SwiperSlide key={product.product_id}>
                <Link
                  to={`/product/${product.product_id}`}
                  className="group flex-shrink-0 w-full rounded-xl shadow-md bg-white border border-gray-100 overflow-hidden transition duration-300 hover:shadow-xl hover:scale-[1.02]"
                >
                  <div className="relative w-full h-[250px] md:h-[400px]">
                    <img
                      src={`${APIURL}/${product.images[0]?.image_url}` || "/images/placeholder.jpg"}
                      alt={product.title}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />

                    {/* Hover Overlay with Product Title */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <p className="text-white text-center text-sm sm:text-lg font-semibold px-4">
                        {product.title}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-center pb-4">
                    <h2 className="text-lg font-bold">{product.title}</h2>
                    <p className="text-gray-700 font-semibold">Rs. {product.price.toFixed(2)}</p>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      <Link key={path} to={`/${path}`}>
        <button
          className="mt-6 bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          style={{ cursor: "pointer !important" }}
        >
          View more
        </button>
      </Link>
    </section>
  );
}

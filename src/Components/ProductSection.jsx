import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function ProductSection({ title }) {
  const APIURL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${APIURL}/ViewProductsController.php`);
        const data = await response.json();
        if (data.status) {
          console.log(data.data);
          setProducts(data.data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        return [];
      }
    };
    fetchProducts();
  }, []);

  const filterProducts = products.filter((product => {
    if(title === "New Arrivals") return product.date_added;
    if(title === "Men's Collection") return product.category_name == "Men";
    if(title === "Women's Collection") return product.category_name == "Women";
  }))

  return (

    <section className="text-center mb-8">
      <h3 className="text-xl sm:text-2xl font-semibold mb-4">{title}</h3>
      <div className="relative">
      <div className="flex overflow-x-auto scrollbar-hide space-x-6 p-4">
      {filterProducts.map((product) => (
        <Link
          to={`/product/${product.product_id}`}
          key={product.product_id}
          className="group flex-shrink-0 w-56 sm:w-64 h-80 sm:h-72 rounded-lg shadow-lg bg-white border border-gray-200 overflow-hidden transform transition duration-300 hover:scale-105"
        >
          <div className="relative w-full h-full">
            {/* Product Image */}
            <img
              src={product.images[0]?.image_url}
              alt={product.title}
              className="w-full h-full object-cover rounded-lg"
            />

            {/* Overlay & Title */}
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
              <p className="text-white text-lg font-semibold">{product.title}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
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

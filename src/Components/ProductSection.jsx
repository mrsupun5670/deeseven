import { Link } from "react-router";

export default function ProductSection({ title }) {
  return (
    <section className="text-center mb-8">
      <h3 className="text-xl sm:text-2xl font-semibold mb-4">{title}</h3>
        <div className="relative">
          <div className="flex overflow-x-scroll scrollbar-hide space-x-4">
            {[...Array(8)].map((_, i) => (
             <Link
             to={`/product/${i + 1}`} // Pass product ID dynamically in the URL
             key={i}
             className="bg-white flex-shrink-0 w-56 h-72 sm:h-60 rounded-lg shadow-md flex items-center justify-center"
           >
             <p className="text-gray-500">Product {i + 1}</p>
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

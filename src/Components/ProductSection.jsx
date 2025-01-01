export default function ProductSection({ title }) {
  return (
    <section className="text-center py-12">
      <h3 className="text-xl sm:text-2xl font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white h-32 sm:h-40 rounded-lg shadow-md flex items-center justify-center"
          >
            <p className="text-gray-500">Product</p>
          </div>
        ))}
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

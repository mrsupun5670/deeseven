const SimilarProducts = () => {
    return (
      <section className="container mx-auto mt-12">
        <h3 className="text-xl font-bold mb-6">You May Also Like</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white border rounded-md overflow-hidden shadow-sm"
            >
              <img
                src="https://samplelib.com/lib/preview/png/sample-boat-400x300.png"
                alt="Product"
                className="w-full h-auto"
              />
              <div className="p-4">
                <p className="font-bold">Comfort Fit T-shirt</p>
                <p className="text-gray-500">Rs. 990.00</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default SimilarProducts;
  
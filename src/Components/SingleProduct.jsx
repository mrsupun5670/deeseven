import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Header from "./Header";
import HashLoader from "react-spinners/HashLoader";
// import Breadcrumb from "./Breadcrumb";

export default function SingleProduct() {
  const APIURL = import.meta.env.VITE_API_URL;

  const [product, setProduct] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [subImages, setSubImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${APIURL}/fetchSingleProduct.php?id=${id}`
        );
        const data = await response.json();
        setLoading(true);
        if(data.status){
          setProduct(data.data);
          setMainImage(data.data.images[0].image_url);
          setSubImages(data.data.images);
          
        } else {
          alert(data.message);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  },[id]);

  console.log(subImages);

  const handleIncrease = () => {
    setQty(qty + 1);
  };

  const handleDecrease = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };
//  console.log(product);

  return (
    <>
      <Header />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
        <HashLoader
          color="#FFB700"
          loading={loading}
          size={50}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
      ) : (
        <section className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="hidden md:flex md:col-span-1 flex-col space-y-4">
            {subImages.map((image, index) => (
              <img
                key={index}
                src={image.image_url}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover cursor-pointer border rounded-md ${
                  mainImage === image ? "border-gray-400" : "border-gray-200"
                } hover:border-gray-400`}
                onClick={() => setMainImage(image.image_url)}
              />
            ))}
          </div>

          <div className="md:flex md:col-span-3 flex justify-center h-full w-full">
            <img
              src={mainImage}
              alt="Product"
              className="w-full h-full object-contain border border-gray-200 rounded-md"
            />
          </div>

          <div className="md:hidden flex gap-2">
            {subImages.map((image, index) => (
              <img
                key={index}
                src={image.image_url}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover cursor-pointer border rounded-md ${
                  mainImage === image ? "border-gray-400" : "border-gray-200"
                } hover:border-gray-400`}
                onClick={() => setMainImage(image.image_url)}
              />
            ))}
          </div>
          
        </div>

        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center space-x-2 text-sm mb-3 text-gray-600">
            <span className="hover:text-black">
              Home / {product.category_name} / {product.title}
            </span>
          </nav>

          {/* Product Title and Price */}
          <h1 className="text-xl sm:text-2xl font-bold mb-2 text-start">
            {product.title}
          </h1>
          <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-start">
            Rs.{product.price.toFixed(2)}
          </p>

          {/* Product Description */}
          <p className="text-gray-600 mb-6 text-start">
            {product.description}
          </p>

          {/* Grid Section for Fabric Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-bold mb-2 text-start">
                About the fabric
              </h2>
              <ul className="list-disc pl-5 text-gray-600">
                {product.fabric.map((fabric, index) => {
                  return <li key={index}>{fabric.about}</li>;
                })}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2 text-start">Fabric Care</h2>
              {product.fabric_care.map((care, index) => {
                return <p className="text-gray-600 text-start " key={index}>{care.fabric_care}</p>;
              })}
            </div>
          </div>

          {/* Grid Section for Add-on Features and Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-bold mb-2 text-start">
                Add-on Features
              </h2>
              <ul className="list-disc pl-5 text-gray-600">
                {product.add_on_features.map((feature, index) => {
                  return <li key={index}>{feature.features}</li>;
                })}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-2 text-start">Note</h2>
              <p className="text-gray-600 text-start">
                {product.note}
              </p>
            </div>
          </div>

          {/* Size, Quantity, and Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="w-full sm:w-auto">
              <label
                htmlFor="size"
                className="block text-lg font-bold mb-2 text-start"
              >
                SIZE:
              </label>
              <div className="flex justify-start gap-2">
                {["Xs", "S", "M", "L"].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeClick(size)}
                    className={`border rounded-lg px-4 py-2 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 ${
                      selectedSize === size
                        ? "bg-gray-400 text-white"
                        : "bg-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full gap-2 flex items-center">
              <button
                className="border rounded-lg px-4 py-2 hover:bg-gray-200"
                onClick={handleDecrease}
              >
                -
              </button>
              <span className="text-lg font-bold">{qty}</span>
              <button
                className="border rounded-lg px-4 py-2 hover:bg-gray-200"
                onClick={handleIncrease}
              >
                +
              </button>
            </div>

            <div className="w-full flex gap-4">
              <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 w-full sm:w-auto">
                ADD TO CART
              </button>
              <button className="text-black px-6 py-2 rounded-lg hover:bg-neutral-400 hover:border-black border w-full sm:w-auto">
                Size Guide
              </button>
            </div>
          </div>
        </div>
      </section>
      )}
    </>
  );
}

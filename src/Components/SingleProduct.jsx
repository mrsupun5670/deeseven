import "swiper/css";
import "swiper/css/scrollbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import HashLoader from "react-spinners/HashLoader";
import "../global.css";
import ProductImage from "./ProductImage";
import { useCart } from "../context/CartProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function SingleProduct() {
  const APIURL = import.meta.env.VITE_API_URL;

  const { cart, dispatch } = useCart();
  const [product, setProduct] = useState({});
  const [mainImage, setMainImage] = useState("");
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [subImages, setSubImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxQty, setMaxQty] = useState(0);
  const [addToCartClicked, setIsAddToCartClicked] = useState(false);
  const [storedUserId, setStoredUserId] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser!= null) {
      setStoredUserId(storedUser.id);
    }
  }, [])
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${APIURL}/fetchSingleProduct.php?id=${id}`
        );
        const data = await response.json();
        setLoading(true);
        if (data.status) {
          setProduct(data.data);
          setMainImage(data.data.images[0].image_url);
          setSubImages(data.data.images);
        } else {
          navigate("/error");
          setLoading(false);
        }
      } catch (error) {
        navigate("/error");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartDatabase = async (userId, size, qty, productId) => {
    setLoading(true);
    try {
      const response = await fetch(`${APIURL}/AddCartItems.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          size: size,
          qty: qty,
          product_id: productId,
        }),
      });
      const data = await response.json();
      if (data.status) {
        dispatch({ type: "SYNC_CART", payload: data.cart });
      }
      if(data.message === "Cart updated") {
        toast.success("Item added to cart", { theme: "light" });
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = () => {
    if (selectedSize !== "") {
      if (qty < maxQty) {
        setQty(qty + 1);
      }
    } else {
      toast.error("Please select a size", { theme: "dark" });
    }
  };

  const handleDecrease = () => {
    if (selectedSize !== "") {
      if (qty > 1) {
        setQty(qty - 1);
      }
    } else {
      toast.error("Please select a size", { theme: "dark" });
    }
  };

  const handleSizeClick = (size, qty) => {
    setSelectedSize(size);
    // setQty(qty);
    setMaxQty(qty);
    setIsAddToCartClicked(false);
  };

  const addToCart = () => {
    setIsAddToCartClicked(true);
    if (selectedSize === "") {
      toast.error("Please select a size", { theme: "dark" });
      return;
    }

    const exsistingItem = cart.find(
      (item) => item.id === product.product_id && item.size === selectedSize
    );
    if (exsistingItem) {
      toast.info("Item already in cart", { theme: "colored" });
      return;
    }

    if (storedUserId) {
      addToCartDatabase(storedUserId, selectedSize, qty, product.product_id);
    }

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.product_id,
        title: product.title,
        price: product.price,
        size: selectedSize,
        qty: qty,
        image: mainImage,
      },
    });

    toast.success("Item added to cart", { theme: "light" });
  };

  return (
    <>
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
        <section className="container mx-auto px-4  overflow-x-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-3">
            {/* Product Image Section */}
            <div className="w-full">
              {/* Main Image */}
              <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] mb-4">
                <ProductImage
                  mainImage={mainImage}
                  product={product}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Desktop Thumbnails (Side) */}
              <div className="hidden md:flex flex-row justify-center gap-4">
                {subImages.map((image, index) => (
                  <img
                    key={index}
                    src={image.image_url}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-16 h-16 object-contain cursor-pointer border rounded-md ${
                      mainImage === image.image_url ? "border-gray-800" : "border-gray-200"
                    } hover:border-gray-400`}
                    onClick={() => setMainImage(image.image_url)}
                  />
                ))}
              </div>
              
              {/* Mobile Thumbnails (Bottom) */}
              <div className="md:hidden flex overflow-x-auto snap-x scrollbar-hide gap-2">
                {subImages.map((image, index) => (
                  <img
                    key={index}
                    src={image.image_url}
                    alt={`Thumbnail ${index + 1}`}
                    className={`flex-shrink-0 w-16 h-16 object-contain cursor-pointer border rounded-md snap-start ${
                      mainImage === image.image_url ? "border-gray-800" : "border-gray-200"
                    } hover:border-gray-400`}
                    onClick={() => setMainImage(image.image_url)}
                  />
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="max-w-full p-4 sm:p-6 bg-white rounded-lg">
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
                Rs.{product.price?.toFixed(2)}
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
                    {product.fabric?.map((fabric, index) => {
                      return <li key={index}>{fabric.about}</li>;
                    })}
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-bold mb-2 text-start">
                    Fabric Care
                  </h2>
                  {product.fabric_care?.map((care, index) => {
                    return (
                      <p className="text-gray-600 text-start " key={index}>
                        {care.fabric_care}
                      </p>
                    );
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
                    {product.add_on_features?.map((feature, index) => {
                      return <li key={index}>{feature.features}</li>;
                    })}
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-bold mb-2 text-start">Note</h2>
                  <p className="text-gray-600 text-start">{product.note}</p>
                </div>
              </div>

              {/* Size, Quantity, and Action Buttons */}
              <div className="flex flex-col space-y-4">
                <div>
                  <label htmlFor="size" className="block text-lg font-bold mb-2 text-start">
                    SIZE:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes?.map((size, index) => (
                      <button
                        key={index}
                        onClick={() => handleSizeClick(size.size_name, size.qty)}
                        className={`border rounded-lg px-4 py-2 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 ${
                          selectedSize === size.size_name ? "bg-gray-800 text-white" : "bg-white"
                        }`}
                      >
                        {size.size_name}
                      </button>
                    ))}
                  </div>
                  
                  {addToCartClicked && selectedSize === "" && (
                    <span className="text-red-600 text-sm block mt-1">
                      Please select a size
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-lg font-medium">Quantity:</span>
                  <div className="flex items-center border rounded-md">
                    <button
                      className="px-3 py-1 hover:bg-gray-100"
                      onClick={handleDecrease}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-medium">{qty}</span>
                    <button
                      className="px-3 py-1 hover:bg-gray-100"
                      onClick={handleIncrease}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 w-full"
                    onClick={addToCart}
                  >
                    ADD TO CART
                  </button>
                  <ToastContainer />
                  <button className="text-black px-6 py-3 rounded-lg hover:bg-neutral-100 border border-black w-full">
                    Size Guide
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
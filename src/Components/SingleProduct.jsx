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
import SimilarProducts from "./SimilarProducts";

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
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser != null) {
      setStoredUserId(storedUser.id);
    }
  }, []);

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
          setMainImage(`${APIURL}/${data.data.images[0].image_url}`);
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
      if (data.message === "Cart updated") {
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
    setMaxQty(qty);
    setQty(1);
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
      (storedUserId);
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
        maxQty: maxQty,
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
        <section className="container mx-auto flex flex-col lg:flex-row gap-4 px-2 sm:px-6">
          {/* Thumbnails - Hidden on small screens */}
          <div className="hidden lg:flex flex-col gap-4">
            {subImages.map((image, index) => (
              <img
                key={index}
                src={`${APIURL}/${image.image_url}`}
                alt={`Thumbnail ${index + 1}`}
                className={`w-20 md:w-28 lg:w-32 h-full sm:h-20 object-contain cursor-pointer border rounded-md ${
                  mainImage === image ? "border-gray-400" : "border-gray-200"
                } hover:border-gray-400`}
                onClick={() => setMainImage(`${APIURL}/${image.image_url}`)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex justify-center items-center w-full md:w-3/4 lg:w-1/2 p-2 sm:p-6">
            <ProductImage
              mainImage={mainImage}
              product={product}
              className="object-cover w-full h-[350px] md:h-[700px]"
            />
          </div>

          {/* Thumbnails - Visible only on small screens */}
          <div className="lg:hidden flex gap-2 p-2 sm:p-6 overflow-auto">
            {subImages.map((image, index) => (
              <img
                key={index}
                src={`${APIURL}/${image.image_url}`}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 sm:w-20 h-16 sm:h-20 object-contain cursor-pointer border rounded-md ${
                  mainImage === image ? "border-gray-400" : "border-gray-200"
                } hover:border-gray-400`}
                onClick={() => setMainImage(`${APIURL}/${image.image_url}`)}
              />
            ))}
          </div>

          {/* Product Details */}
          <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg w-full">
            <nav className="flex flex-wrap items-center space-x-2 text-sm mb-3 text-gray-600">
              <span className="hover:text-black">
                Home / {product.category_name} / {product.title}
              </span>
            </nav>

            <h1 className="text-lg sm:text-2xl font-bold mb-2 text-start">
              {product.title}
            </h1>
            <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 text-start">
              Rs.{product.price.toFixed(2)}
            </p>
            <p className="text-gray-600 mb-6 text-start">
              {product.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-lg font-bold mb-2 text-start">
                  About the fabric
                </h2>
                <ul className="list-disc pl-5 text-gray-600">
                  {product.fabric.map((fabric, index) => (
                    <li key={index}>{fabric.about}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-bold mb-2 text-start">
                  Fabric Care
                </h2>
                {product.fabric_care.map((care, index) => (
                  <p className="text-gray-600 text-start " key={index}>
                    {care.fabric_care}
                  </p>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-lg font-bold mb-2 text-start">
                  Add-on Features
                </h2>
                <ul className="list-disc pl-5 text-gray-600">
                  {product.add_on_features.map((feature, index) => (
                    <li key={index}>{feature.features}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-bold mb-2 text-start">Note</h2>
                <p className="text-gray-600 text-start">{product.note}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="w-full sm:w-auto">
                <label
                  htmlFor="size"
                  className="block text-lg font-bold mb-2 text-start"
                >
                  SIZE:
                </label>
                <div className="flex justify-start flex-wrap gap-2">
                  {product.sizes.map((size, index) => (
                    <button
                      key={index}
                      onClick={() => handleSizeClick(size.size_name, size.quantity)}
                      className={`border rounded-lg px-3 py-2 text-sm sm:text-base hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 ${
                        selectedSize === size.size_name
                          ? "bg-gray-400 text-white"
                          : "bg-white"
                      }`}
                    >
                      {size.size_name}
                    </button>
                  ))}
                </div>
              </div>
              <span className="text-red-600 text-sm">
                {addToCartClicked && selectedSize === ""
                  ? "Please select a size"
                  : ""}
              </span>

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

              <div className="w-full flex gap-4 flex-wrap">
                {product.product_status === 1 ? (
                  <button
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 w-full sm:w-auto"
                    onClick={addToCart}
                  >
                    ADD TO CART
                  </button>
                ) : (
                  <button
                  disabled
                    className="bg-black disabled:opacity-50 text-white px-6 py-2 rounded-lg hover:bg-gray-800 w-full sm:w-auto"
                    onClick={addToCart}
                  >
                    ADD TO CART
                  </button>
                )}
                <ToastContainer />
                <button className="text-black px-6 py-2 rounded-lg hover:bg-neutral-400 hover:border-black border w-full sm:w-auto">
                  Size Guide
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      <SimilarProducts
        subCategory={product.sub_category_name}
        productId={product.product_id}
      />
    </>
  );
}
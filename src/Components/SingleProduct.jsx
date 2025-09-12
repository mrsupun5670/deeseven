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
  const [open, setOpen] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const isWomen = product?.category_name?.toLowerCase() === "women";

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
      storedUserId;
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
              selectedSize={selectedSize}
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
                      onClick={() =>
                        handleSizeClick(size.size_name, size.quantity)
                      }
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

              {!selectedSize && (
                <span className="text-red-600 text-sm">
                  Please select a size
                </span>
              )}

              <div className="w-full flex gap-4 flex-wrap">
                {product.sizes.map((size, index) => {
                  if (size.size_name === selectedSize) {
                    if (size.quantity == 0) {
                      return (
                        <button
                          key={index}
                          disabled
                          className="bg-black disabled:opacity-50 text-white px-6 py-2 rounded-lg hover:bg-gray-800 w-full sm:w-auto"
                          onClick={addToCart}
                        >
                          ADD TO CART
                        </button>
                      );
                    } else {
                      return (
                        <button
                          key={index}
                          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 w-full sm:w-auto"
                          onClick={addToCart}
                        >
                          ADD TO CART
                        </button>
                      );
                    }
                  }
                  return null;
                })}

                <ToastContainer />
                <button
                  onClick={() => setOpen(true)}
                  className="text-black px-6 py-2 rounded-lg hover:bg-neutral-400 hover:border-black border w-full sm:w-auto"
                >
                  Size Guide
                </button>
                {open && (
                  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
                      {/* Close Button */}
                      <button
                        onClick={() => setOpen(false)}
                        className="absolute top-3 right-3 text-gray-600 hover:text-black"
                      >
                        ✕
                      </button>

                      {/* Title */}
                      <h2 className="text-xl font-bold mb-4">Size Guide</h2>

                      {/* Size Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-4 py-2">
                                Size
                              </th>
                              <th className="border border-gray-300 px-4 py-2">
                                Chest
                              </th>
                              <th className="border border-gray-300 px-4 py-2">
                                Shoulder
                              </th>
                              <th className="border border-gray-300 px-4 py-2">
                                Sleeve
                              </th>
                              <th className="border border-gray-300 px-4 py-2">
                                Length
                              </th>
                              <th className="border border-gray-300 px-4 py-2">
                                Collar
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {isWomen ? (
                              // Women Size Guide
                              <>
                                <tr>
                                  <td className="border px-4 py-2">S</td>
                                  <td className="border px-4 py-2">17</td>
                                  <td className="border px-4 py-2">15</td>
                                  <td className="border px-4 py-2">7</td>
                                  <td className="border px-4 py-2">25</td>
                                  <td className="border px-4 py-2">14</td>
                                </tr>
                                <tr>
                                  <td className="border px-4 py-2">M</td>
                                  <td className="border px-4 py-2">18</td>
                                  <td className="border px-4 py-2">15 3/4</td>
                                  <td className="border px-4 py-2">7 1/2</td>
                                  <td className="border px-4 py-2">26</td>
                                  <td className="border px-4 py-2">14 1/2</td>
                                </tr>
                                <tr>
                                  <td className="border px-4 py-2">L</td>
                                  <td className="border px-4 py-2">19</td>
                                  <td className="border px-4 py-2">16 1/2</td>
                                  <td className="border px-4 py-2">8</td>
                                  <td className="border px-4 py-2">27</td>
                                  <td className="border px-4 py-2">15</td>
                                </tr>
                                <tr>
                                  <td className="border px-4 py-2">XL</td>
                                  <td className="border px-4 py-2">20</td>
                                  <td className="border px-4 py-2">17 1/4</td>
                                  <td className="border px-4 py-2">8 1/2</td>
                                  <td className="border px-4 py-2">28</td>
                                  <td className="border px-4 py-2">15 1/2</td>
                                </tr>
                              </>
                            ) : (
                              // Men Size Guide
                              <>
                                <tr>
                                  <td className="border px-4 py-2">S</td>
                                  <td className="border px-4 py-2">19</td>
                                  <td className="border px-4 py-2">16 1/4</td>
                                  <td className="border px-4 py-2">8 1/4</td>
                                  <td className="border px-4 py-2">27</td>
                                  <td className="border px-4 py-2">15 3/8</td>
                                </tr>
                                <tr>
                                  <td className="border px-4 py-2">M</td>
                                  <td className="border px-4 py-2">20</td>
                                  <td className="border px-4 py-2">17 3/4</td>
                                  <td className="border px-4 py-2">8 1/2</td>
                                  <td className="border px-4 py-2">28</td>
                                  <td className="border px-4 py-2">16 1/4</td>
                                </tr>
                                <tr>
                                  <td className="border px-4 py-2">L</td>
                                  <td className="border px-4 py-2">21 1/2</td>
                                  <td className="border px-4 py-2">19 1/4</td>
                                  <td className="border px-4 py-2">9</td>
                                  <td className="border px-4 py-2">29</td>
                                  <td className="border px-4 py-2">17 1/8</td>
                                </tr>
                                <tr>
                                  <td className="border px-4 py-2">XL</td>
                                  <td className="border px-4 py-2">23</td>
                                  <td className="border px-4 py-2">20 3/4</td>
                                  <td className="border px-4 py-2">9 3/4</td>
                                  <td className="border px-4 py-2">30 1/2</td>
                                  <td className="border px-4 py-2">17 7/8</td>
                                </tr>
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Notes */}
                      <ul className="mt-4 text-sm text-gray-700 list-disc pl-6">
                        <li>All dimensions are given in inches</li>
                        <li>සියලුම මානයන් අඟල් වලින් දක්වා ඇත.</li>
                        <li>
                          அனைத்து பரிமாணங்களும் அங்குலங்களில்
                          கொடுக்கப்பட்டுள்ளன.
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
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

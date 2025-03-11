import { useEffect, useState } from "react";
import OrderDetails from "../Components/OrderDetails";
import BillingDetails from "../Components/BillingDetails";
import ShippingDetails from "../Components/ShippingDetails";
import logo from "../assets/logo.png";

export default function Checkout() {
  const [useBillingForShipping, setUseBillingForShipping] = useState(true);

 useEffect(() => {
    const fetchProducts = async () => {
      const user = JSON.parse(sessionStorage.getItem("user"));

      console.log(user);
      // try {
      //   const response = await fetch(`${APIURL}/GetCheckoutDataController.php`, {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   });

      //   if (response.ok) {
      //     const data = await response.json();
      //     if (data.response) {
      //       setProducts(data.products);
      //     } else {
      //       alert(data.message);
      //       if (data.message === "Unauthorized") {
      //         sessionStorage.clear();
      //         window.location.href = "/";
      //       }
      //     }
      //   }
      // } catch (error) {
      //   console.error("Error fetching products:", error);
      //   alert("Failed to load products. Please try again later.");
      // }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-8 flex justify-center">
            <div className="w-full max-w-[1280px]">

      <div className="flex flex-row justify-between mb-10">
        <p className=" font-bold text-3xl">Checkout</p>
        <img src={logo} alt="Logo" className="w-32 md:w-40" />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3 w-full order-2 md:order-1">
          <BillingDetails />
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={useBillingForShipping}
                onChange={(e) => setUseBillingForShipping(e.target.checked)}
                className="mr-2"
              />
              Use billing address for shipping
            </label>
          </div>
          {!useBillingForShipping && <ShippingDetails />}
          <div className="flex flex-row  font-bold mt-4 mb-4">
            <button className="bg-black w-full text-white font-bold p-3 hover:bg-gray-800 rounded-full">
              Place Order
            </button>
          </div>
        </div>

        <div className="md:w-1/3 w-full order-1 md:order-2">
          <OrderDetails />
        </div>
      </div>
    </div>    </div>

  );
}

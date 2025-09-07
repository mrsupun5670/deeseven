import { useEffect, useState } from "react";
import OrderDetails from "../Components/OrderDetails";
import BillingDetails from "../Components/BillingDetails";
import ShippingDetails from "../Components/ShippingDetails";
import logo from "../assets/logo.png";
import { useLocation } from "react-router";
import { useCart } from "../context/CartProvider";
import { toast, ToastContainer } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

const APIURL = import.meta.env.VITE_API_URL;

export default function Checkout() {
  const user = localStorage.getItem("user");
  const sessionCart = sessionStorage.getItem("cart");
  
  if (user === null || sessionCart === null || JSON.parse(sessionCart).length === 0) {
      sessionStorage.clear();
      window.location.href = "/";
  }
  

  const location = useLocation();
  const { userID } = location.state || {};
  const { cart, dispatch } = useCart();

  const [useBillingForShipping, setUseBillingForShipping] = useState(true);
  const [billingData, setBillingData] = useState(null);
  const [shippingData, setShippingData] = useState(null);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [addressId, setAddressId] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [orderId, setOrderId] = useState("1111"); // change with payhere order ID
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Get address ID to place order
  const getAddressID = async () => {
    try {
      const response1 = await fetch(`${APIURL}/GetAddressIdController.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          user_id: userID,
          line1: billingData.line1,
          line2: billingData.line2,
          city_id: billingData.city_id,
          postal_code: billingData.postal_code,
        }),
      });

      const data = await response1.json();

      if (data.status) {
        const address_id = data.address_id;
        // console.log(address_id);
        setAddressId(address_id);
        return address_id; // Return the ID for immediate use
      }
      return null;
    } catch (error) {
      console.error("Error getting address ID:", error);
      toast.error("Error retrieving address information");
      return null;
    }
  };

  // If user selects shipping address
  // first save the address into address table and then get the address id
  const saveAddressID = async () => {
    try {
      const response1 = await fetch(
        `${APIURL}/SaveAndGetAddressIdController.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            line1: shippingData.line1,
            line2: shippingData.line2,
            city_id: shippingData.city_id,
            postal_code: shippingData.postal_code,
          }),
        }
      );

      const data = await response1.json();

      if (data.status) {
        const address_id = data.address_id;
        setAddressId(address_id);
        return address_id; // Return the ID for immediate use
      }
      return null;
    } catch (error) {
      console.error("Error saving address ID:", error);
      toast.error("Error saving address information");
      return null;
    }
  };

  const saveOrder = async (addressIdToUse) => {
    try {
      const response = await fetch(`${APIURL}/CompleteOrderController.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          customer_id: userID,
          address_id: addressIdToUse, // Use the passed ID instead of state
          totalAmount: totalAmount,
          orderItems: orderItems,
        }),
      });

      const data = await response.json();
      // console.log(data);
      if (data.status) {
        sessionStorage.removeItem("cart");
        dispatch({ type: "CLEAR_CART" });
        setLoading(false);
        alert("Order placed successfully!");
        window.location.href = "/payment-success";
      } else {
        setLoading(false);
        toast.error("Order could not be completed", { theme: "light" });
      }
    } catch (error) {
      console.error("Error completing order:", error);
      setLoading(false);
      toast.error("Something went wrong, cannot proceed", { theme: "light" });
    }
  };

  const placeOrder = async () => {
    setError("");
    setLoading(true);

    if (!billingData) {
      setError("Billing data is missing");
      setLoading(false);
      return;
    }

    if (
      !billingData.city_id ||
      !billingData.district_id ||
      !billingData.line1 ||
      !billingData.line2 ||
      !billingData.email ||
      !billingData.fname ||
      !billingData.lname ||
      !billingData.mobile
    ) {
      setError("All billing fields are required");
      setLoading(false);
      return;
    }

    if (!useBillingForShipping) {
      if (
        !shippingData ||
        !shippingData.city_id || // Fixed to use city_id instead of city
        !shippingData.district_id || // Fixed to use district_id instead of district
        !shippingData.line1 ||
        !shippingData.line2 ||
        !shippingData.email ||
        !shippingData.fname ||
        !shippingData.lname ||
        !shippingData.mobile
      ) {
        setError("All shipping fields are required");
        setLoading(false);
        return;
      }
    }

    try {
      // Get the address ID first, then save the order
      let addressIdToUse;

      if (useBillingForShipping) {
        addressIdToUse = await getAddressID();
      } else {
        addressIdToUse = await saveAddressID();
      }

      if (!addressIdToUse) {
        setError("Could not retrieve or save address information");
        setLoading(false);
        return;
      }

      // Now that we have the address ID, save the order
      await saveOrder(addressIdToUse); // call the save order when payhere on success

      // try {
      //   const response = await fetch(`${APIURL}/PlaceOrderController.php`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       user_id: userID,
      //       shipping_address: shippingAddress,
      //       totalAmount: totalAmount,
      //     }),
      //   });

      //   if (response.ok) {
      //     const data = await response.json();

      //     payhere.onCompleted = function onCompleted(orderId) {
      //       console.log("Payment completed. OrderID:" + orderId);
      //       // Note: validate the payment and show success or failure page to the customer
      //         saveOrder();
      //       }

      //     // Payment window closed
      //     payhere.onDismissed = function onDismissed() {
      //       // Note: Prompt user to pay again or show an error page
      //       console.log("Payment dismissed");
      //     };

      //     // Error occurred
      //     payhere.onError = function onError(error) {
      //       // Note: show an error page
      //       console.log("Error:" + error);
      //     };

      //     var payment = {
      //       sandbox: true,
      //       merchant_id: data.merchant_id,
      //       return_url: "http://sample.com/notify",
      //       cancel_url: undefined,
      //       notify_url: "http://sample.com/notify",
      //       order_id: data.order_id,
      //       items: "Product 01",
      //       amount: data.amount,
      //       currency: data.currency,
      //       hash: data.hash, // *Replace with generated hash retrieved from backend
      //       first_name: data.fname,
      //       last_name: data.lname,
      //       email: data.email,
      //       phone: data.mobile,
      //       address: data.line1 + " " + data.line2,
      //       city: data.city,
      //       country: "Sri Lanka",
      //       delivery_address:
      //         data.line1 +
      //         " " +
      //         data.line2 +
      //         ", " +
      //         data.city +
      //         " " +
      //         data.district +
      //         ", " +
      //         "Sri Lanka",
      //       delivery_city: data.city,
      //       delivery_country: "Sri Lanka",
      //     };

      //     payhere.startPayment(payment);

      //   } else {
      //     setError("Something went wrong, cannot proceed");
      //   }
      // } catch (error) {
      //   console.error("Error placing order:", error);
      //   setError("Something went wrong, cannot proceed");
      // }
    } catch (error) {
      console.error("Error in order placement flow:", error);
      setError("Something went wrong, cannot proceed");
      setLoading(false);
    }
  };

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-[1280px]">
        <div className="flex flex-row justify-between mb-10">
          <p className="font-bold text-3xl">Checkout</p>
          <img src={logo} alt="Logo" className="w-32 md:w-40" />
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <HashLoader color="#FFB700" loading={loading} size={50} />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3 w-full order-2 md:order-1">
              <BillingDetails setBillingData={setBillingData} />
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
              {error && (
                <div className="bg-red-100 text-red-800 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {!useBillingForShipping && (
                <ShippingDetails setShippingData={setShippingData} />
              )}
              <div className="flex flex-row font-bold mt-4 mb-4">
                <button
                  onClick={placeOrder}
                  className="bg-black w-full text-white font-bold p-3 hover:bg-gray-800 rounded-full"
                >
                  Place Order
                </button>
                <ToastContainer />
              </div>
            </div>

            <div className="md:w-1/3 w-full order-1 md:order-2">
              <OrderDetails
                userID={userID}
                setTotalAmount={setTotalAmount}
                setOrderItems={setOrderItems}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

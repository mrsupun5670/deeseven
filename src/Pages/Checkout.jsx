import { useEffect, useState } from "react";
import OrderDetails from "../Components/OrderDetails";
import BillingDetails from "../Components/BillingDetails";
import ShippingDetails from "../Components/ShippingDetails";
import logo from "../assets/logo.png";
import { useLocation } from "react-router";
import { useCart } from "../context/CartProvider";

const APIURL = import.meta.env.VITE_API_URL;

export default function Checkout() {
  if (localStorage.getItem("user") === null) {
    alert("Unautherized access!");
    sessionStorage.clear();
    window.location.href = "/";
  }

  const location = useLocation();
  const { userID } = location.state || {};
  const {cart, dispatch} = useCart();

  const [useBillingForShipping, setUseBillingForShipping] = useState(true);
  const [billingData, setBillingData] = useState(null);
  const [shippingData, setShippingData] = useState(null);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [addressId, setAddressId] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [orderId, setOrderId] = useState("1111"); // change with payhere order ID

  
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
    const response1 = await fetch(
      `${APIURL}/GetAddressIdController.php?user_id=${userID}`);

      const data = await response1.json();

      if(data.status) {
        const address_id = data.address_id;
        console.log(address_id);
        setAddressId(address_id);
      }
  }

  // If user selects shipping address
  // first save the address into address table and then get the address id
  const saveAddressID = async () => {
    const response1 = await fetch(
      `${APIURL}/SaveAndGetAddressIdController.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          line1: shippingData.line1,
          line2: shippingData.line2,
          city_id: shippingData.city_id,
          postal_code: shippingData.postal_code
        }
      )}
    );

      const data = await response1.json();
      
      if(data.status) {
        const address_id = data.address_id;
        setAddressId(address_id);
      }
  }

  const saveOrder = async () => {
    try {
      const response = await fetch(
        `${APIURL}/CompleteOrderController.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: orderId,
            customer_id : userID,
            address_id: addressId,
            totalAmount: totalAmount,
            orderItems: orderItems
          }),
        }
      )

      const data = await response.json();
      console.log(data);
      if(data.status) {
        sessionStorage.removeItem("cart");
        dispatch({type: "CLEAR_CART"});
        alert("Order placed successfully!")
      }
      
    } catch (error) {
      console.error("Error completing order:", error);
    }
  }

  const placeOrder = async () => {
    setError("");

    if (!billingData) {
      setError("Billing data is missing");
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
      return;
    }

    if (!useBillingForShipping) {
      if (
        shippingData.city === "" ||
        shippingData.district === "" ||
        shippingData.line1 === "" ||
        shippingData.line2 === "" ||
        shippingData.email === "" ||
        shippingData.fname === "" ||
        shippingData.lname === "" ||
        shippingData.mobile === ""
      ) {
        setError("All fields are required");
        return;
      }
    }

    const shippingAddress = useBillingForShipping ? billingData : shippingData;

    if(useBillingForShipping) {
      getAddressID();
    } else {
      saveAddressID();
    }

    saveOrder();

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
  };

  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-[1280px]">
        <div className="flex flex-row justify-between mb-10">
          <p className="font-bold text-3xl">Checkout</p>
          <img src={logo} alt="Logo" className="w-32 md:w-40" />
        </div>

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
            </div>
          </div>

          <div className="md:w-1/3 w-full order-1 md:order-2">
            <OrderDetails userID={userID} setTotalAmount={setTotalAmount} setOrderItems={setOrderItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState, useReducer } from "react";

const initialState = {
  firstName: "",
  lastName: "",
  streetAddress: "",
  additionalInfo: "",
  district: "",
  city: "",
  emailAddress: "",
  mobileNumber: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CUSTOMER_DATA":
      return {
        ...state,
        ...action.payload,
      };
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    default:
      return state;
  }
};

const BillingDetails = () => {
  const APIURL = import.meta.env.VITE_API_URL;

  const [formData, dispatch] = useReducer(reducer, initialState);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch(`${APIURL}/GetDistrictsController.php`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.response) {
            setDistricts(data.districts);
          }
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    const fetchCustomer = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) {
          alert("User data not found. Please log in again.");
          sessionStorage.clear();
          window.location.href = "/";
          return;
        }

        const response = await fetch(
          `${APIURL}/GetCheckoutDataController.php?id=${user.customer_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.response) {
            setCustomer(data.customer);
            dispatch({
              type: "SET_CUSTOMER_DATA",
              payload: {
                firstName: data.customer.fname || "",
                lastName: data.customer.lname || "",
                streetAddress: data.customer.line1 || "",
                additionalInfo: data.customer.line2 || "",
                district: data.customer.district_id || "",
                city: data.customer.city_id || "",
                emailAddress: data.customer.email || "",
                mobileNumber: data.customer.mobile || "",
              },
            });
          } else {
            alert(data.message);
            if (data.message === "Unauthorized") {
              sessionStorage.clear();
              window.location.href = "/";
            }
          }
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
        alert("Failed to load customer data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
    fetchCustomer();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: "UPDATE_FIELD",
      field: name,
      value: value,
    });
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    dispatch({
      type: "UPDATE_FIELD",
      field: "district",
      value: districtId,
    });
    dispatch({
      type: "UPDATE_FIELD",
      field: "city",
      value: "",
    });

    try {
      const response = await fetch(
        `${APIURL}/GetCitiesByDistrictController.php?district_id=${districtId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.response) {
          setCities(data.cities);
        }
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Billing Address</h2>
      <form className="mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <input
            type="text"
            placeholder="Street Address"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            placeholder="Additional Address Info"
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />

          <div className="flex gap-4 text-gray-400">
            <select
              name="district"
              value={formData.district}
              onChange={handleDistrictChange}
              className="p-2 border rounded w-full"
            >
              <option value="" className="text-gray-400" disabled>
                District
              </option>
              {districts.map((district) => (
                <option
                  key={district.id}
                  value={district.id}
                  className="text-black"
                >
                  {district.name}
                </option>
              ))}
            </select>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            >
              <option value="" className="text-gray-400" disabled>
                City
              </option>
              {cities.map((city) => (
                <option key={city.id} value={city.id} className="text-black">
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Email Address"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default BillingDetails;
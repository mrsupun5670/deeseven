import { useEffect, useState, useReducer } from "react";

const BillingDetails = () => {
  const APIURL = import.meta.env.VITE_API_URL;

  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [customer, setCustomer] = useState(null);

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

            fetchCustomer();

          }
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch({
      type: "UPDATE_FIELD",
      field: name,
      value: value,
    });
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
          console.log(data.customer);
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
              value={customer.fname}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={customer.lname}
              onChange={handleChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <input
            type="text"
            placeholder="Street Address"
            name="streetAddress"
            value={customer.line1}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            placeholder="Additional Address Info"
            name="additionalInfo"
            value={customer.line2}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />

          <div className="flex gap-4 text-gray-400">
            <select
              name="district"
              value={customer.district_id}
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
              value={customer.city_id}
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
            value={customer.email}
            onChange={handleChange}
            className="p-2 border rounded w-full"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Mobile Number"
              name="mobileNumber"
              value={customer.mobile}
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

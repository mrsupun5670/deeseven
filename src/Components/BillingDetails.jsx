import { useEffect, useState } from "react";

const BillingDetails = () => {
  const APIURL = import.meta.env.VITE_API_URL;

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
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          alert("User data not found. Please log in again.");
          sessionStorage.clear();
          window.location.href = "/";
          return;
        }

        const response = await fetch(
          `${APIURL}/GetCheckoutDataController.php?id=${user.id}`,
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
            console.log(data.customer);
            setCustomer(data.customer);
          } else {
            setCustomer(null);
            console.log(data.message);
            if (data.message === "Unauthorized") {
              localStorage.clear();
              window.location.href = "/";
            }
          }
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
    fetchCustomer();
  }, []);

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;

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
              className="p-2 border rounded w-full"
              value={customer ? customer.fname : ""}
              onChange={(e) =>
                setCustomer({ ...customer, fname: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={customer ? customer.lname : ""}
              onChange={(e) =>
                setCustomer({ ...customer, lname: e.target.value })
              }
              className="p-2 border rounded w-full"
            />
          </div>
          <input
            type="text"
            placeholder="Street Address(line 1)"
            name="streetAddress"
            value={customer ? customer.line1 : ""}
            onChange={(e) =>
              setCustomer({ ...customer, line1: e.target.value })
            }
            className="p-2 border rounded w-full"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Additional Address Info(line 2)"
              name="additionalInfo"
              className="p-2 border rounded w-full"
              value={customer ? customer.line2 : ""}
              onChange={(e) =>
                setCustomer({ ...customer, line2: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Postal Code"
              name="postalCode"
              className="p-2 border rounded w-full"
              value={customer ? customer.postal_code : ""}
              onChange={(e) =>
                setCustomer({ ...customer, postal_code: e.target.value })
              }
            />
          </div>

          <div className="flex gap-4 text-gray-400">
            <select
              name="district"
              value={""}
              onChange={handleDistrictChange}
              className="p-2 border rounded w-full"
            >
              <option value="" className="text-gray-400" disabled>
                {customer?customer.district: "District"}
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
            <select name="city" className="p-2 border rounded w-full">
              <option value="" className="text-gray-400" disabled>
                {customer?customer.city: "City"}
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
            value={customer ? customer.email : ""}
            onChange={(e) =>
              setCustomer({ ...customer, email: e.target.value })
            }
            className="p-2 border rounded w-full"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Mobile Number"
              name="mobileNumber"
              className="p-2 border rounded w-full"
              value={customer ? customer.mobile : ""}
              onChange={(e) =>
                setCustomer({ ...customer, mobile: e.target.value })
              }
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default BillingDetails;

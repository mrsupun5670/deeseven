import { useEffect, useState } from "react";

const BillingDetails = ({ setBillingData }) => {
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
            setCustomer(data.customer);
            if(data.customer != null) {
              setBillingData(data.customer);
            } 
            
            // If the customer has a district_id, fetch the corresponding cities
            if (data.customer.district_id) {
              fetchCitiesByDistrict(data.customer.district_id);
            }
          } else {
            setBillingData({
              fname: "",
              lname: "",
              line1: "",
              line2: "",
              district: "",
              city: "",
              email: "",
              mobile: "",
            });

            if (data.message === "unathorized") {
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
  }, [APIURL, setBillingData]);

  const fetchCitiesByDistrict = async (districtId) => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedCustomer = { ...customer, [name]: value };
    setCustomer(updatedCustomer);
    setBillingData(updatedCustomer);
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    const selectedDistrict = districts.find(d => d.id === districtId);
    
    // Update customer with the selected district
    const updatedCustomer = { 
      ...customer, 
      district: selectedDistrict?.name || "",
      district_id: districtId,
      // Clear city when district changes
      city: "",
      city_id: "" 
    };
    
    setCustomer(updatedCustomer);
    setBillingData(updatedCustomer);
    
    // Fetch cities for the selected district
    fetchCitiesByDistrict(districtId);
  };

  const handleCityChange = (e) => {
    const cityId = e.target.value;
    const selectedCity = cities.find(c => c.id === cityId);
    
    const updatedCustomer = { 
      ...customer, 
      city: selectedCity?.name || "",
      city_id: cityId 
    };
    
    setCustomer(updatedCustomer);
    setBillingData(updatedCustomer);
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
              name="fname"
              className="p-2 border rounded w-full"
              value={customer?.fname || ""}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lname"
              value={customer?.lname || ""}
              onChange={handleInputChange}
              className="p-2 border rounded w-full"
            />
          </div>
          <input
            type="text"
            placeholder="Street Address(line 1)"
            name="line1"
            value={customer?.line1 || ""}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Additional Address Info(line 2)"
              name="line2"
              className="p-2 border rounded w-full"
              value={customer?.line2 || ""}
              onChange={handleInputChange}
            />
            <input
              type="text"
              placeholder="Postal Code"
              name="postal_code"
              className="p-2 border rounded w-full"
              value={customer?.postal_code || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex gap-4">
            <select
              name="district"
              value={customer?.district_id || ""}
              onChange={handleDistrictChange}
              className="p-2 border rounded w-full"
            >
              <option value="" disabled>
                Select District
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
              value={customer?.city_id || ""}
              onChange={handleCityChange}
              className="p-2 border rounded w-full"
            >
              <option value="" disabled>
                Select City
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
            name="email"
            value={customer?.email || ""}
            onChange={handleInputChange}
            className="p-2 border rounded w-full"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Mobile Number"
              name="mobile"
              className="p-2 border rounded w-full"
              value={customer?.mobile || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default BillingDetails;
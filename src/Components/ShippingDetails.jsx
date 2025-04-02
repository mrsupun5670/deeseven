import { useEffect, useState } from "react";

const ShippingDetails = ({ setShippingData }) => {
  const APIURL = import.meta.env.VITE_API_URL;

  const [shipping, setShipping] = useState({
    fname: "",
    lname: "",
    line1: "",
    line2: "",
    postal_code: "",
    district_id: "",
    city_id: "",
    email: "",
    mobile: "",
  });

  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  // Fetch districts on component mount
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
    fetchDistricts();
  }, []);

  // Update parent state when shipping changes
  useEffect(() => {
    setShippingData(shipping);
  }, [shipping, setShippingData]);

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;

    // Update district_id state and reset city_id
    setShipping((prev) => ({ ...prev, district_id: districtId, city_id: "" }));

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
      <h2 className="text-xl font-bold">Shipping Address</h2>
      <form className="mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex gap-4">
            <input
              type="text"
              name="fname"
              placeholder="First Name"
              className="p-2 border rounded w-full"
              value={shipping.fname}
              onChange={handleInputChanges}
            />
            <input
              type="text"
              name="lname"
              placeholder="Last Name"
              className="p-2 border rounded w-full"
              value={shipping.lname}
              onChange={handleInputChanges}
            />
          </div>

          <input
            type="text"
            name="line1"
            placeholder="Street Address"
            className="p-2 border rounded w-full"
            value={shipping.line1}
            onChange={handleInputChanges}
          />
          <div className="flex gap-4">
            <input
              type="text"
              name="line2"
              placeholder="Additional Address Info"
              className="p-2 border rounded w-full"
              value={shipping.line2}
              onChange={handleInputChanges}
            />
            <input
              type="text"
              name="postal_code"
              placeholder="Postal Code"
              className="p-2 border rounded w-full"
              value={shipping.postal_code}
              onChange={handleInputChanges}
            />
          </div>

          <div className="flex gap-4 text-gray-400">
            <select
              name="district_id"
              value={shipping.district_id}
              onChange={handleDistrictChange}
              className="p-2 border rounded w-full"
            >
              <option value="" className="text-gray-400" disabled>
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
              name="city_id"
              value={shipping.city_id}
              onChange={handleInputChanges}
              className="p-2 border rounded w-full"
              disabled={!shipping.district_id}
            >
              <option value="" className="text-gray-400" disabled>
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
            name="email"
            placeholder="Email Address"
            className="p-2 border rounded w-full"
            value={shipping.email}
            onChange={handleInputChanges}
          />
          <div className="flex gap-4">
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              className="p-2 border rounded w-full"
              value={shipping.mobile}
              onChange={handleInputChanges}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShippingDetails;

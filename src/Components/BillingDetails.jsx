const BillingDetails = () => {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold">Billing Address</h2>
      <form className="mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="p-2 border rounded w-full"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="p-2 border rounded w-full"
            />
          </div>
          <input
            type="text"
            placeholder="Street Address"
            className="p-2 border rounded w-full"
          />
          <input
            type="text"
            placeholder="Additional Address Info"
            className="p-2 border rounded w-full"
          />

          <div className="flex gap-4 text-gray-400">
            <select className="p-2 border rounded w-full">
              <option value="" className="text-gray-400">
                 District
              </option>
            </select>
            <select className="p-2 border rounded w-full">
              <option value="" className="text-gray-400">
                 City
              </option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Email Address"
            className="p-2 border rounded w-full"
          />
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Mobile Number"
              className="p-2 border rounded w-full"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default BillingDetails;

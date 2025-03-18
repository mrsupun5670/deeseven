import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus, Upload, X } from "lucide-react";

const ProductAdd = () => {
  const APIURL = import.meta.env.VITE_API_URL;

  const [images, setImages] = useState(Array(3).fill(null));
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [sizes, setSizes] = useState([]);

  const [fabricDetails, setFabricDetails] = useState([
    { key: Date.now(), value: "" },
  ]);
  const [note, setNote] = useState([{ key: Date.now(), value: "" }]);
  const [fabricCare, setFabricCare] = useState([
    { key: Date.now(), value: "" },
  ]);
  const [addOnFeatures, setAddOnFeatures] = useState([
    { key: Date.now(), value: "" },
  ]);

  const [productTitle, setProductTitle] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${APIURL}/LoadAddProductUIData.php`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.response === true) {
            setCategories(data.categories);
            setSubCategories(data.sub_categories);
          } else {
            toast.error(data.message);
            if (data.message === "Unauthorized") {
              sessionStorage.removeItem("authToken");
              sessionStorage.removeItem("userRole");
              sessionStorage.removeItem("admin");
              window.location.href = "/";
            }
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load categories. Please try again later.");
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedSubCategory) {
      const fetchSizesBySubCategory = async () => {
        try {
          const response = await fetch(`${APIURL}/GetSizeBySubCategory.php`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({ sub_category_id: selectedSubCategory }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.response === true) {
              setSizes(data.sizes);
            } else {
              toast.error(data.message);
            }
          }
        } catch (error) {
          console.error("Error fetching sizes:", error);
          toast.error("Failed to load sizes. Please try again later.");
        }
      };

      fetchSizesBySubCategory();
    }
  }, [selectedSubCategory]);

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length === 3) {
      const newImages = Array.from(files).map((file, index) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        file: file,
      }));
      setImages(newImages);
    } else {
      toast.error("Please select 3 images.");
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  const handleAddField = (setFunction) => {
    setFunction((prev) => [...prev, { key: Date.now(), value: "" }]);
  };

  const handleRemoveField = (index, setFunction) => {
    setFunction((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, setFunction, value) => {
    setFunction((prev) =>
      prev.map((item, i) => (i === index ? { ...item, value } : item))
    );
  };

  const handleSizeQuantityChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length < 3) {
      toast.error("Please select 3 images.");
      return;
    }

    const productData = {
      title: productTitle,
      description: productDescription,
      category_id: productCategory,
      sub_category_id: selectedSubCategory,
      price: productPrice,
      fabric_details: fabricDetails.map((item) => item.value),
      notes: note.map((item) => item.value),
      fabric_care: fabricCare.map((item) => item.value),
      add_on_features: addOnFeatures.map((item) => item.value),
      sizes: sizes.map((size) => ({
        size_id: size.size_id,
        quantity: size.quantity || 0,
      })),
    };

    const formData = new FormData();
    formData.append("productData", JSON.stringify(productData));

    images.forEach((image, index) => {
      if (image) {
        formData.append(`image_${index}`, image.file);
      }
    });

    try {
      const response = await fetch(`${APIURL}/AddProductController.php`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response === true) {
          toast.success("Product added successfully!");
        } else {
          toast.error(data.message);
        }
      } else {
        toast.error("Failed to add product. Please try again later.");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product. Please try again later.");
    }
  };

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="w-full space-y-2">
            <label className="text-sm font-medium">Product Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product title"
              value={productTitle}
              onChange={(e) => setProductTitle(e.target.value)}
            />
          </div>
          <div className="w-full space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="2"
              placeholder="Enter product description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h2 className="text-sm font-medium">About the Fabric</h2>
              {fabricDetails.map((item, index) => (
                <div key={item.key} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) =>
                      handleInputChange(index, setFabricDetails, e.target.value)
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter about the fabric"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveField(index, setFabricDetails)}
                    className="px-2 text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddField(setFabricDetails)}
                className="px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-medium">Note</h2>
              {note.map((item, index) => (
                <div key={item.key} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) =>
                      handleInputChange(index, setNote, e.target.value)
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter note"
                  />
                
                </div>
              ))}
             
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-medium">Fabric Care</h2>
              {fabricCare.map((item, index) => (
                <div key={item.key} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) =>
                      handleInputChange(index, setFabricCare, e.target.value)
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter fabric care"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveField(index, setFabricCare)}
                    className="px-2 text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddField(setFabricCare)}
                className="px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-medium">Add-on Feature</h2>
              {addOnFeatures.map((item, index) => (
                <div key={item.key} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) =>
                      handleInputChange(index, setAddOnFeatures, e.target.value)
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter add-on features"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveField(index, setAddOnFeatures)}
                    className="px-2 text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddField(setAddOnFeatures)}
                className="px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sub Category</label>
              <select
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedSubCategory}
                onChange={handleSubCategoryChange}
              >
                <option value="">Select sub-category</option>
                {subCategories.map((subCategory) => (
                  <option
                    key={subCategory.sub_category_id}
                    value={subCategory.sub_category_id}
                  >
                    {subCategory.sub_category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-sm font-medium">Sizes and Quantities</h2>
            <div className="grid grid-cols-2 gap-4">
              {sizes.map((size, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={size.size_name}
                    onChange={(e) =>
                      handleSizeQuantityChange(index, "size", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled
                  />
                  <input
                    type="number"
                    min="0"
                    value={size.quantity || ""}
                    onChange={(e) =>
                      handleSizeQuantityChange(
                        index,
                        "quantity",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-medium">Product Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`border-2 border-dashed rounded-lg p-4 ${
                    image ? "border-blue-500" : "border-gray-300"
                  }`}
                >
                  {image ? (
                    <div className="relative group">
                      <img
                        src={image.url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-80 object-contain rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center space-y-2 cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Upload Image {index + 1}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e)}
                        multiple
                        max={3}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between md:justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 w-1/3 md:w-full"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-2/3 md:w-full"
          >
            Save Product
          </button>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default ProductAdd;
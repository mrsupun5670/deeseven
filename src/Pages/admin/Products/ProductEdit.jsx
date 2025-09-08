import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Plus, X, Upload, ArrowLeft, Save, Trash2, Package, Layers, Edit, Image } from "lucide-react";

const ProductEdit = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const APIURL = import.meta.env.VITE_API_URL || "";

  const fileInputRef = useRef(null);

  const [productData, setProductData] = useState({
    id: "",
    title: "",
    description: "",
    price: 0,
    category: { id: "", name: "" },
    sub_category: { id: "", name: "" },
    images: [],
    sizes: [],
    fabric: [""],
    fabric_care: [""],
    notes: [""],
    add_on_features: [""],
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [selectedImages, setSelectedImages] = useState([null, null, null]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeSection, setActiveSection] = useState("basic");

  const sectionRefs = {
    basic: useRef(null),
    details: useRef(null),
    inventory: useRef(null),
    images: useRef(null),
  };

  // Load initial data (categories, subcategories)
  useEffect(() => {
    const loadInitialData = async () => {
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
            setCategories(data.categories || []);
            setSubCategories(data.sub_categories || []);
          } else {
            toast.error(data.message);
          }
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Failed to load initial data");
      }
    };

    loadInitialData();
  }, [APIURL]);

  // Load product data
  useEffect(() => {
    const loadProductData = async () => {
      if (!productId) return;

      setIsLoading(true);

      try {
        const productResponse = await fetch(
          `${APIURL}/fetchEditSingleProduct.php?id=${productId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
            },
          }
        );

        if (productResponse.ok) {
          const productData = await productResponse.json();
          if (productData.status) {
            const product = productData.data;

            // Map the product data to component state
            const mappedProduct = {
              id: product.product_id,
              title: product.title || "",
              description: product.description || "",
              price: Number(product.price) || 0,
              category: {
                id: product.category_id.toString(),
                name: product.category_name,
              },
              sub_category: {
                id: product.sub_category_id.toString(),
                name: product.sub_category_name,
              },
              images: product.images.map((img) => img.image_url),
              sizes: product.sizes || [],
              fabric: product.fabric.map((f) => f.about) || [""],
              fabric_care: product.fabric_care.map((fc) => fc.fabric_care) || [""],
              notes: product.notes.map((n) => n.note) || [""],
              add_on_features: product.add_on_features.map((f) => f.features) || [""],
            };

            // Set product data
            setProductData(mappedProduct);

            // Set existing images
            if (mappedProduct.images && mappedProduct.images.length > 0) {
              const imageUrlsWithAPI = mappedProduct.images.map((img) => `${APIURL}/${img}`);
              setImageUrls(imageUrlsWithAPI);
              
              // Create mock file objects for existing images
              const mockFiles = mappedProduct.images.map((img, index) => ({
                name: img.split("/").pop(),
                size: 0,
                type: "image/jpeg",
                isExisting: true
              }));
              setSelectedImages(mockFiles);
            }

            // Load available sizes for the sub-category
            if (mappedProduct.sub_category.id) {
              await loadSizesForSubCategory(mappedProduct.sub_category.id);
            }

          } else {
            toast.error(productData.message || "Failed to load product");
          }
        } else {
          toast.error("Failed to fetch product details");
        }
      } catch (error) {
        console.error("Error loading product data:", error);
        toast.error("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [productId, APIURL]);

  const loadSizesForSubCategory = async (subCategoryId) => {
    try {
      const sizesResponse = await fetch(`${APIURL}/GetSizeBySubCategory.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ sub_category_id: subCategoryId }),
      });

      if (sizesResponse.ok) {
        const sizesData = await sizesResponse.json();
        if (sizesData.response === true) {
          setAvailableSizes(sizesData.sizes || []);
          
          // Merge available sizes with existing product sizes
          const mergedSizes = sizesData.sizes.map((availableSize) => {
            const existingSize = productData.sizes.find(
              (productSize) => productSize.size_id === availableSize.size_id
            );
            
            return {
              size_id: availableSize.size_id,
              size_name: availableSize.size_name,
              quantity: existingSize ? parseInt(existingSize.quantity) || 0 : 0,
            };
          });

          setProductData((prev) => ({
            ...prev,
            sizes: mergedSizes,
          }));
        } else {
          toast.error(sizesData.message);
        }
      }
    } catch (error) {
      console.error("Error loading sizes:", error);
      toast.error("Failed to load sizes");
    }
  };

  const handleArrayUpdate = (field, index, value) => {
    setProductData((prev) => {
      const currentArray = [...(prev[field] || [])];
      currentArray[index] = value;
      return { ...prev, [field]: currentArray };
    });
  };

  const handleAddArrayItem = (field) => {
    setProductData((prev) => {
      const currentArray = [...(prev[field] || [])];
      return { ...prev, [field]: [...currentArray, ""] };
    });
  };

  const handleRemoveArrayItem = (field, index) => {
    setProductData((prev) => {
      const currentArray = [...(prev[field] || [])];
      if (currentArray.length > 1) {
        currentArray.splice(index, 1);
        return { ...prev, [field]: currentArray };
      }
      return prev;
    });
  };

  const handleSizeQuantityChange = (index, quantity) => {
    setProductData((prev) => {
      const newSizes = [...(prev.sizes || [])];
      if (newSizes[index]) {
        newSizes[index] = { ...newSizes[index], quantity: parseInt(quantity) || 0 };
      }
      return { ...prev, sizes: newSizes };
    });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages = [...selectedImages];
      const newImageUrls = [...imageUrls];

      files.forEach((file, index) => {
        if (index < 3) {
          newImages[index] = file;
          newImageUrls[index] = URL.createObjectURL(file);
        }
      });

      setSelectedImages(newImages);
      setImageUrls(newImageUrls);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...selectedImages];
    const newImageUrls = [...imageUrls];

    // Clean up URL if it was created by createObjectURL
    if (newImageUrls[index] && newImageUrls[index].startsWith('blob:')) {
      URL.revokeObjectURL(newImageUrls[index]);
    }

    newImages[index] = null;
    newImageUrls[index] = "";

    setSelectedImages(newImages);
    setImageUrls(newImageUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validation
      if (!productData.title?.trim()) {
        toast.error("Product title is required");
        return;
      }

      if (!productData.price || productData.price <= 0) {
        toast.error("Please enter a valid price");
        return;
      }

      if (!productData.description?.trim()) {
        toast.error("Please enter description");
        return;
      }

      if (!productData.category?.id) {
        toast.error("Please select a category");
        return;
      }

      if (!productData.sub_category?.id) {
        toast.error("Please select a sub-category");
        return;
      }

      const validFabricDetails = productData.fabric.filter((f) => f.trim() !== "");
      if (validFabricDetails.length === 0) {
        toast.error("Please add at least one fabric detail");
        return;
      }

      const validFabricCare = productData.fabric_care.filter((fc) => fc.trim() !== "");
      if (validFabricCare.length === 0) {
        toast.error("Please add at least one fabric care instruction");
        return;
      }

      const validNotes = productData.notes.filter((n) => n.trim() !== "");
      if (validNotes.length === 0) {
        toast.error("Please add at least one note");
        return;
      }

      const validFeatures = productData.add_on_features.filter((f) => f.trim() !== "");
      if (validFeatures.length === 0) {
        toast.error("Please add at least one add-on feature");
        return;
      }

      const sizesWithQuantity = productData.sizes.filter(size => size.quantity > 0);
      if (sizesWithQuantity.length === 0) {
        toast.error("Please add at least one size with a quantity greater than 0");
        return;
      }

      const hasImages = selectedImages.some((img) => img !== null) || imageUrls.some((url) => url !== "");
      if (!hasImages) {
        toast.error("Please upload at least one product image");
        return;
      }

      // Prepare API data
      const apiData = {
        productId: productData.id,
        title: productData.title.trim(),
        description: productData.description.trim(),
        category_id: productData.category.id,
        sub_category_id: productData.sub_category.id,
        price: parseFloat(productData.price),
        fabric_details: validFabricDetails,
        notes: validNotes,
        fabric_care: validFabricCare,
        add_on_features: validFeatures,
        sizes: sizesWithQuantity.map((size) => ({
          size_id: size.size_id,
          quantity: size.quantity,
        })),
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(apiData));

      // Only append new images (not existing ones)
      selectedImages.forEach((image, index) => {
        if (image && !image.isExisting) {
          formData.append(`image_${index}`, image);
        }
      });

      const response = await fetch(`${APIURL}/UpdateProductController.php`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.response === true) {
          toast.success("Product updated successfully");
          navigate("../");
        } else {
          toast.error(result.message || "Failed to update product");
        }
      } else {
        toast.error("Server error. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    const sectionRef = sectionRefs[section]?.current;
    if (sectionRef) {
      sectionRef.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="h-12 w-12 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600 animate-pulse">Loading product data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-white shadow-lg border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Edit className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
                      <p className="text-sm text-gray-500">Update product information</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-8">
                {Object.keys(sectionRefs).map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeSection === section
                        ? "border-yellow-500 text-yellow-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <form className="space-y-8">
              {/* Basic Information */}
              <section
                ref={sectionRefs.basic}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Package className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                    <p className="text-gray-600">Edit the fundamental product details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Enter product title"
                      value={productData.title || ""}
                      onChange={(e) =>
                        setProductData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (Rs.) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="0.00"
                      value={productData.price || ""}
                      onChange={(e) =>
                        setProductData((prev) => ({
                          ...prev,
                          price: parseFloat(e.target.value) || 0,
                        }))
                      }
                      min={0}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter product description"
                    value={productData.description || ""}
                    onChange={(e) =>
                      setProductData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      value={productData.category?.id || ""}
                      disabled
                    >
                      <option value={productData.category?.id}>
                        {productData.category?.name}
                      </option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Category cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Category
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      value={productData.sub_category?.id || ""}
                      disabled
                    >
                      <option value={productData.sub_category?.id}>
                        {productData.sub_category?.name}
                      </option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Sub-category cannot be changed</p>
                  </div>
                </div>
              </section>

              {/* Product Details */}
              <section
                ref={sectionRefs.details}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Layers className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
                    <p className="text-gray-600">Specify fabric, care instructions, and features</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Fabric Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Fabric</h3>
                    <div className="space-y-3">
                      {productData.fabric?.map((item, index) => (
                        <div
                          key={`fabric-${index}`}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="text"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter fabric details"
                            value={item}
                            onChange={(e) =>
                              handleArrayUpdate("fabric", index, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveArrayItem("fabric", index)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            disabled={productData.fabric?.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddArrayItem("fabric")}
                        className="flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Detail
                      </button>
                    </div>
                  </div>

                  {/* Fabric Care */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Fabric Care</h3>
                    <div className="space-y-3">
                      {productData.fabric_care?.map((item, index) => (
                        <div
                          key={`care-${index}`}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="text"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter fabric care instructions"
                            value={item}
                            onChange={(e) =>
                              handleArrayUpdate(
                                "fabric_care",
                                index,
                                e.target.value
                              )
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveArrayItem("fabric_care", index)
                            }
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            disabled={productData.fabric_care?.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddArrayItem("fabric_care")}
                        className="flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Instruction
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                    <div className="space-y-3">
                      {productData.notes?.map((item, index) => (
                        <div
                          key={`note-${index}`}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="text"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter note"
                            value={item}
                            onChange={(e) =>
                              handleArrayUpdate("notes", index, e.target.value)
                            }
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveArrayItem("notes", index)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            disabled={productData.notes?.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddArrayItem("notes")}
                        className="flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Note
                      </button>
                    </div>
                  </div>

                  {/* Add-on Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add-on Features</h3>
                    <div className="space-y-3">
                      {productData.add_on_features?.map((item, index) => (
                        <div
                          key={`feature-${index}`}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="text"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            placeholder="Enter feature"
                            value={item}
                            onChange={(e) =>
                              handleArrayUpdate(
                                "add_on_features",
                                index,
                                e.target.value
                              )
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveArrayItem("add_on_features", index)
                            }
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            disabled={productData.add_on_features?.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddArrayItem("add_on_features")}
                        className="flex items-center text-sm font-medium text-yellow-600 hover:text-yellow-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Feature
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Inventory */}
              <section
                ref={sectionRefs.inventory}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
                    <p className="text-gray-600">Manage sizes and stock quantities</p>
                  </div>
                </div>

                {productData.sizes && productData.sizes.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {productData.sizes.map((size, index) => (
                      <div
                        key={`size-${size.size_id || index}`}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-yellow-300 transition-colors"
                      >
                        <div className="text-center">
                          <div className="font-semibold text-gray-900 mb-2">
                            {size.size_name}
                          </div>
                          <input
                            type="number"
                            min="0"
                            className="w-full px-3 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            value={size.quantity || ""}
                            onChange={(e) =>
                              handleSizeQuantityChange(
                                index,
                                e.target.value
                              )
                            }
                          />
                          <div className="text-xs text-gray-500 mt-1">Quantity</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No sizes available for this product
                    </p>
                  </div>
                )}
              </section>

              {/* Images */}
              <section
                ref={sectionRefs.images}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Image className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Product Images</h2>
                    <p className="text-gray-600">Upload up to 3 product images</p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array(3)
                    .fill(null)
                    .map((_, index) => (
                      <div
                        key={`image-slot-${index}`}
                        className="relative"
                      >
                        <div
                          className={`h-64 rounded-lg border-2 border-dashed transition-all ${
                            imageUrls[index]
                              ? "border-yellow-300 bg-yellow-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {imageUrls[index] ? (
                            <div className="relative group h-full">
                              <img
                                src={imageUrls[index]}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="p-2 bg-white rounded-full shadow-lg text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors p-6"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="h-12 w-12 text-gray-400 mb-4" />
                              <p className="text-center text-gray-600">
                                <span className="font-medium">Click to upload</span>
                                <br />
                                <span className="text-sm">PNG, JPG up to 10MB</span>
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-center mt-2">
                          <span className="text-xs text-gray-500">
                            Image {index + 1}
                            {index === 0 && " (Primary)"}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Upload className="h-5 w-5 text-blue-600 mt-0.5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Image Guidelines</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Upload high-quality images for better customer engagement</li>
                          <li>First image will be used as the primary product image</li>
                          <li>Recommended size: 800x800 pixels or larger</li>
                          <li>Supported formats: JPG, PNG</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Action buttons - sticky bottom bar */}
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20">
                <div className="max-w-7xl mx-auto flex justify-between md:justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium shadow-lg"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Update Product
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default ProductEdit;
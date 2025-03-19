import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Plus, X, Upload, ArrowLeft, Save } from "lucide-react";
import { cn } from "../../../lib/utils";

const ProductAdd = () => {
  const navigate = useNavigate();
  const APIURL = import.meta.env.VITE_API_URL || "";

  const fileInputRef = useRef(null);

  // State for product data
  const [productData, setProductData] = useState({
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
    add_on_features: [""]
  });

  // State for UI data
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedImages, setSelectedImages] = useState([null, null, null]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeSection, setActiveSection] = useState("basic");

  const sectionRefs = {
    basic: useRef(null),
    details: useRef(null),
    inventory: useRef(null),
    images: useRef(null)
  };

  // Helper functions
  const createArrayWithEmptyString = (length) => Array(length).fill("");

  // Load product data on component mount
  useEffect(() => {
    const loadProductData = async () => {
      setIsLoading(true);

      try {
        // First load categories and sub-categories
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
              localStorage.removeItem("userRole");
              localStorage.removeItem("admin");
              navigate("/");
            }
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };

    loadProductData();
  }, [APIURL, navigate]);

  // Load sizes when sub-category changes
  useEffect(() => {
    const loadSizes = async () => {
      const subCategoryId = productData.sub_category?.id;

      if (!subCategoryId) return;

      try {
        const response = await fetch(`${APIURL}/GetSizeBySubCategory.php`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ sub_category_id: subCategoryId }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.response === true) {
            const newSizes = data.sizes.map((size) => ({
              size_id: size.size_id,
              size_name: size.size_name,
              quantity: 0
            }));

            setProductData(prev => ({ ...prev, sizes: newSizes }));
          } else {
            toast.error(data.message);
          }
        }
      } catch (error) {
        console.error("Error fetching sizes:", error);
        toast.error("Failed to load sizes");
      }
    };

    if (productData.sub_category?.id) {
      loadSizes();
    }
  }, [productData.sub_category?.id, APIURL]);

  // Update handler for array fields
  const handleArrayUpdate = (field, index, value) => {
    setProductData(prev => {
      const currentArray = [...(prev[field] || [])];
      currentArray[index] = value;
      return { ...prev, [field]: currentArray };
    });
  };

  // Add new item to array field
  const handleAddArrayItem = (field) => {
    setProductData(prev => {
      const currentArray = [...(prev[field] || [])];
      return { ...prev, [field]: [...currentArray, ""] };
    });
  };

  // Remove item from array field
  const handleRemoveArrayItem = (field, index) => {
    setProductData(prev => {
      const currentArray = [...(prev[field] || [])];
      if (currentArray.length > 1) {
        currentArray.splice(index, 1);
        return { ...prev, [field]: currentArray };
      }
      return prev;
    });
  };

  // Handle size quantity change
  const handleSizeQuantityChange = (index, quantity) => {
    setProductData(prev => {
      const newSizes = [...(prev.sizes || [])];
      if (newSizes[index]) {
        newSizes[index] = { ...newSizes[index], quantity };
      }
      return { ...prev, sizes: newSizes };
    });
  };

  // Handle image selection
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

  // Remove image
  const handleRemoveImage = (index) => {
    const newImages = [...selectedImages];
    const newImageUrls = [...imageUrls];

    newImages[index] = null;
    newImageUrls[index] = "";

    setSelectedImages(newImages);
    setImageUrls(newImageUrls);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const category = categories.find(c => c.category_id === categoryId);

    setProductData(prev => ({
      ...prev,
      category: { id: categoryId, name: category?.category_name || "" },
      sub_category: { id: "", name: "" }, // Reset sub-category
      sizes: [] // Reset sizes
    }));
  };

  // Handle sub-category change
  const handleSubCategoryChange = (e) => {
    const subCategoryId = e.target.value;
    const subCategory = subCategories.find(sc => sc.sub_category_id === subCategoryId);

    setProductData(prev => ({
      ...prev,
      sub_category: { id: subCategoryId, name: subCategory?.sub_category_name || "" },
      sizes: [] // Reset sizes when sub-category changes
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate form
      if (!productData.title) {
        toast.error("Product title is required");
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

      if (!productData.price || productData.price <= 0) {
        toast.error("Please enter a valid price");
        return;
      }

      // Check if we have at least one image
      const hasImages = selectedImages.some(img => img !== null);

      if (!hasImages) {
        toast.error("Please upload at least one product image");
        return;
      }

      // Prepare data for API
      const apiData = {
        title: productData.title,
        description: productData.description,
        category_id: productData.category?.id,
        sub_category_id: productData.sub_category?.id,
        price: productData.price,
        fabric_details: productData.fabric?.filter(f => f.trim() !== ""),
        notes: productData.notes?.filter(n => n.trim() !== ""),
        fabric_care: productData.fabric_care?.filter(fc => fc.trim() !== ""),
        add_on_features: productData.add_on_features?.filter(f => f.trim() !== ""),
        sizes: productData.sizes?.map(size => ({
          size_id: size.size_id,
          quantity: size.quantity || 0
        }))
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(apiData));

      // Append new images
      selectedImages.forEach((image, index) => {
        if (image) {
          formData.append(`image_${index}`, image);
        }
      });

      // Send to API
      const response = await fetch(`${APIURL}/AddProductController.php`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.response === true) {
          toast.success("Product added successfully");
          navigate('/products');
        } else {
          toast.error(result.message || "Failed to add product");
        }
      } else {
        toast.error("Server error. Please try again later.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    }
  };

  // Scroll to section
  const scrollToSection = (section) => {
    setActiveSection(section);
    const sectionRef = sectionRefs[section]?.current;
    if (sectionRef) {
      sectionRef.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 animate-fade-in">
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <div className="space-y-4 text-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
            <p className="text-muted-foreground animate-pulse">Loading product data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header with navigation */}
          <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm">
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate(-1)}
                  className="p-2 rounded-full hover:bg-secondary transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-semibold">Add New Product</h1>
              </div>
            </div>
          </header>
          
          {/* Navigation tabs */}
          <div className="container mt-8">
            <div className="flex space-x-1 bg-secondary/50 p-1 rounded-lg max-w-xl mx-auto">
              {Object.keys(sectionRefs).map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all duration-200",
                    activeSection === section
                      ? "bg-white shadow-sm text-primary"
                      : "text-muted-foreground hover:bg-white/50"
                  )}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="container mt-8">
            <form className="max-w-4xl mx-auto space-y-12">
              {/* Basic Information */}
              <section 
                ref={sectionRefs.basic}
                className="space-y-6 card-glass p-8"
                style={{ "--delay": "1" }}
              >
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-1 bg-primary rounded-full"></div>
                  <h2 className="text-2xl font-semibold">Basic Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="field-group" style={{ "--delay": "1" }}>
                    <label className="block text-sm font-medium mb-1 ml-1">Product Title</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Enter product title"
                      value={productData.title || ""}
                      onChange={(e) => setProductData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="field-group" style={{ "--delay": "2" }}>
                    <label className="block text-sm font-medium mb-1 ml-1">Price</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="0.00"
                      value={productData.price || ""}
                      onChange={(e) => setProductData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    min={0}
                    />
                  </div>
                </div>
                
                <div className="field-group" style={{ "--delay": "3" }}>
                  <label className="block text-sm font-medium mb-1 ml-1">Description</label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Enter product description"
                    value={productData.description || ""}
                    onChange={(e) => setProductData(prev => ({ ...prev, description: e.target.value }))}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="field-group" style={{ "--delay": "4" }}>
                    <label className="block text-sm font-medium mb-1 ml-1">Category</label>
                    <select
                      className="input-field"
                      value={productData.category?.id || ""}
                      onChange={handleCategoryChange}
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                          {category.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  

                  <div className="field-group" style={{ "--delay": "5" }}>
                    <label className="block text-sm font-medium mb-1 ml-1">Sub Category</label>
                    <select
                      className="input-field"
                      value={productData.sub_category?.id || ""}
                      onChange={handleSubCategoryChange}
                    >
                      <option value="">Select sub-category</option>
                      {subCategories
                        .filter(sc => !productData.category?.id || sc.category_id === productData.category.id)
                        .map((subCategory) => (
                          <option key={subCategory.sub_category_id} value={subCategory.sub_category_id}>
                            {subCategory.sub_category_name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </section>
              
              {/* Details Information */}
              <section 
                ref={sectionRefs.details}
                className="space-y-6 card-glass p-8"
                style={{ "--delay": "2" }}
              >
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-1 bg-primary rounded-full"></div>
                  <h2 className="text-2xl font-semibold">Product Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Fabric Details */}
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">About the Fabric</h3>
                    {productData.fabric?.map((item, index) => (
                      <div key={`fabric-${index}`} className="flex items-center space-x-2">
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Enter fabric details"
                          value={item}
                          onChange={(e) => handleArrayUpdate('fabric', index, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('fabric', index)}
                          className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                          disabled={productData.fabric?.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('fabric')}
                      className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Detail
                    </button>
                  </div>
                  
                  {/* Fabric Care */}
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Fabric Care</h3>
                    {productData.fabric_care?.map((item, index) => (
                      <div key={`care-${index}`} className="flex items-center space-x-2">
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Enter fabric care instructions"
                          value={item}
                          onChange={(e) => handleArrayUpdate('fabric_care', index, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('fabric_care', index)}
                          className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                          disabled={productData.fabric_care?.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('fabric_care')}
                      className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Instruction
                    </button>
                  </div>
                  
                  {/* Notes */}
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Note</h3>
                    {productData.notes?.map((item, index) => (
                      <div key={`note-${index}`} className="flex items-center space-x-2">
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Enter note"
                          value={item}
                          onChange={(e) => handleArrayUpdate('notes', index, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  
                  {/* Add-on Features */}
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Add-on Features</h3>
                    {productData.add_on_features?.map((item, index) => (
                      <div key={`feature-${index}`} className="flex items-center space-x-2">
                        <input
                          type="text"
                          className="input-field"
                          placeholder="Enter feature"
                          value={item}
                          onChange={(e) => handleArrayUpdate('add_on_features', index, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('add_on_features', index)}
                          className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                          disabled={productData.add_on_features?.length === 1}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('add_on_features')}
                      className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Feature
                    </button>
                  </div>
                </div>
              </section>
              
              {/* Inventory */}
              <section 
                ref={sectionRefs.inventory}
                className="space-y-6 card-glass p-8"
                style={{ "--delay": "3" }}
              >
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-1 bg-primary rounded-full"></div>
                  <h2 className="text-2xl font-semibold">Inventory</h2>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-base font-medium">Sizes and Quantities</h3>
                  
                  {productData.sizes && productData.sizes.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {productData.sizes.map((size, index) => (
                        <div key={`size-${size.size_id}`} className="bg-white rounded-lg p-4 shadow-sm border border-border/50">
                          <div className="font-medium text-sm mb-2">{size.size_name}</div>
                          <input
                            type="number"
                            min="0"
                            className="input-field text-center"
                            value={size.quantity || ""}
                            onChange={(e) => handleSizeQuantityChange(index, Number(e.target.value))}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-secondary/50 rounded-lg p-6 text-center">
                      <p className="text-muted-foreground">
                        {productData.sub_category?.id 
                          ? "No sizes available for this sub-category" 
                          : "Please select a sub-category to view available sizes"}
                      </p>
                    </div>
                  )}
                </div>
              </section>
              
              {/* Images */}
              <section 
                ref={sectionRefs.images}
                className="space-y-6 card-glass p-8"
                style={{ "--delay": "4" }}
              >
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-1 bg-primary rounded-full"></div>
                  <h2 className="text-2xl font-semibold">Product Images</h2>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array(3).fill(null).map((_, index) => (
                      <div 
                        key={`image-slot-${index}`}
                        className={cn(
                          "h-60 rounded-lg border-2 border-dashed transition-all duration-300",
                          imageUrls[index] 
                            ? "border-primary/50 hover:border-primary"
                            : "border-muted-foreground/25 hover:border-muted-foreground/50"
                        )}
                      >
                        {imageUrls[index] ? (
                          <div className="relative group h-full">
                            <img
                              src={imageUrls[index]}
                              alt={`Product ${index + 1}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="p-2 bg-white rounded-full shadow-lg text-red-500 transform scale-90 hover:scale-100 transition-all duration-200"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors duration-200 p-4"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-center text-muted-foreground">
                              Click to upload<br />product image
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              
              {/* Action buttons - sticky bottom bar */}
              <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border/40 p-4 shadow-lg">
                <div className="container flex justify-between md:justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/products')}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Add Product
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductAdd;
import React, { useEffect, useState } from "react";
import { Upload, FileText, Tag, DollarSign, Plus, X, Image } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const AddNewArticle = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    is_free: 1,
    pdf: null,
    image: null,
  });
  const [handleSubmitLoading, setHandleSubmitLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageDragActive, setImageDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchCategoriesList = async () => {
    try {
      const response = await axios.get(`${apiUrl}article-categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoriesList();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (file) => {
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, pdf: file }));
      setErrors((prev) => ({ ...prev, pdf: "" }));
    } else {
      setErrors((prev) => ({ ...prev, pdf: "Please select a valid PDF file" }));
    }
  };

  const handleImageChange = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (file && allowedTypes.includes(file.type)) {
      // Check file size (optional - limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image size should be less than 5MB" }));
        return;
      }
      setFormData((prev) => ({ ...prev, image: file }));
      setErrors((prev) => ({ ...prev, image: "" }));
    } else {
      setErrors((prev) => ({ ...prev, image: "Please select a valid image file (JPG, PNG)" }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleImageDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, pdf: null }));
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    else if (formData.description.length < 50) newErrors.description = "Description should be at least 50 characters";
    if (!formData.category_id) newErrors.category_id = "Please select a category";
    if (!formData.pdf) newErrors.pdf = "PDF file is required";
    if (!formData.image) newErrors.image = "Image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setHandleSubmitLoading(true);
    
    try {
      const submissionData = new FormData();
      submissionData.append("title", formData.title);
      submissionData.append("description", formData.description);
      submissionData.append("category_id", formData.category_id);
      submissionData.append("is_free", formData.is_free);
      submissionData.append("pdf", formData.pdf);
      submissionData.append("image", formData.image);

      // Log what we're sending for debugging
      for (let [key, value] of submissionData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(`${apiUrl}articles`, submissionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Article created successfully!");
        setFormData({
          title: "",
          description: "",
          category_id: "",
          is_free: 1,
          pdf: null,
          image: null,
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error details:", error);
      
      // More detailed error information
      if (error.response) {
        console.error("Server response:", error.response.data);
        console.error("Status code:", error.response.status);
        
        if (error.response.data?.errors) {
          const serverErrors = error.response.data.errors;
          setErrors(serverErrors);
          Object.values(serverErrors).forEach(errorMsg => {
            toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
          });
        } else {
          toast.error(error.response.data?.message || "Failed to create article");
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("No response from server. Check your connection.");
      } else {
        console.error("Request setup error:", error.message);
        toast.error("Request failed: " + error.message);
      }
    } finally {
      setHandleSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Article</h1>
          </div>
          <p className="text-gray-600">Create and publish a new article for your audience</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              Article Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter your article title..."
              className={`w-full px-4 py-3 rounded-xl border-2 transition-colors text-lg ${
                errors.title ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
              } focus:outline-none`}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Write a compelling description for your article..."
              rows={6}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-colors resize-none ${
                errors.description ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
              } focus:outline-none`}
            />
            <div className="flex justify-between items-center mt-2">
              {errors.description ? (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.description}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Minimum 50 characters</p>
              )}
              <span className={`text-sm ${formData.description.length < 50 ? "text-red-500" : "text-green-600"}`}>
                {formData.description.length} characters
              </span>
            </div>
          </div>

          {/* Category and Pricing Row */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category Selection */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <Tag className="w-5 h-5 text-blue-600" />
                Category
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-colors appearance-none ${
                  errors.category_id ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                } focus:outline-none cursor-pointer`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <X className="w-4 h-4" />
                  {errors.category_id}
                </p>
              )}
            </div>

            {/* Pricing Toggle */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                <DollarSign className="w-5 h-5 text-blue-600" />
                Pricing
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="is_free"
                    checked={formData.is_free === 1}
                    onChange={() => setFormData((prev) => ({ ...prev, is_free: 1 }))}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <div>
                    <span className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                      Free Article
                    </span>
                    <p className="text-sm text-gray-500">Available to all users</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="is_free"
                    checked={formData.is_free === 0}
                    onChange={() => setFormData((prev) => ({ ...prev, is_free: 0 }))}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <div>
                    <span className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                      Premium Article
                    </span>
                    <p className="text-sm text-gray-500">Requires subscription</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <Image className="w-5 h-5 text-blue-600" />
              Article Image
            </label>

            {!formData.image ? (
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
                  imageDragActive
                    ? "border-blue-500 bg-blue-50"
                    : errors.image
                    ? "border-red-300 hover:border-red-400"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleImageDrag}
                onDragLeave={handleImageDrag}
                onDragOver={handleImageDrag}
                onDrop={handleImageDrop}
              >
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleImageChange(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <Image className={`mx-auto w-12 h-12 mb-4 ${imageDragActive ? "text-blue-600" : "text-gray-400"}`} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop your image here</h3>
                  <p className="text-gray-600 mb-4">or click to browse files</p>
                  <p className="text-sm text-gray-500 mb-4">Supports JPG, PNG (max 5MB)</p>
                  <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Choose Image
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Image className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">{formData.image.name}</p>
                      <p className="text-sm text-green-700">{(formData.image.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Image Preview */}
                <div className="w-full max-w-xs mx-auto">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            )}

            {errors.image && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.image}
              </p>
            )}
          </div>

          {/* PDF Upload Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <Upload className="w-5 h-5 text-blue-600" />
              Upload PDF
            </label>

            {!formData.pdf ? (
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : errors.pdf
                    ? "border-red-300 hover:border-red-400"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <Upload className={`mx-auto w-12 h-12 mb-4 ${dragActive ? "text-blue-600" : "text-gray-400"}`} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop your PDF file here</h3>
                  <p className="text-gray-600 mb-4">or click to browse files</p>
                  <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Choose File
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">{formData.pdf.name}</p>
                    <p className="text-sm text-green-700">{(formData.pdf.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {errors.pdf && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.pdf}
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={handleSubmitLoading}
              className={`inline-flex items-center gap-2 px-8 py-4 font-semibold rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 shadow-lg hover:shadow-xl ${
                handleSubmitLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105"
              }`}
            >
              {handleSubmitLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Article
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewArticle;
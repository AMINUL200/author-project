import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Upload, FileText, DollarSign, Plus, X, Image, Trash2, Link, Globe, Edit, Eye } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const AddNewArticle = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract query parameters for edit mode
  const searchParams = new URLSearchParams(location.search);
  const updateId = searchParams.get("update");
  const isUpdateMode = Boolean(updateId);

  const [loading, setLoading] = useState(isUpdateMode);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    is_free: 1,
    pdf: null,
    images: [],
    links: [],
  });
  const [existingImages, setExistingImages] = useState([]);
  const [existingPdf, setExistingPdf] = useState(null);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [handleSubmitLoading, setHandleSubmitLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageDragActive, setImageDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const [newLink, setNewLink] = useState({ platform: "", url: "" });

  // Fetch article data when in update mode
  useEffect(() => {
    if (isUpdateMode && updateId) {
      fetchArticleData();
    }
  }, [isUpdateMode, updateId]);

  const fetchArticleData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}article-edit/${updateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.data;
        setFormData({
          title: data.title || "",
          description: data.description || "",
          is_free: data.is_free === "0" ? 0 : 1,
          pdf: null, // We'll handle existing PDF separately
          images: [], // We'll handle existing images separately
          links: data.links || [],
        });
        
        // Set existing images and PDF for display
        if (data.images && data.images.length > 0) {
          setExistingImages(data.images);
        }
        if (data.pdf_path) {
          setExistingPdf(data.pdf_path);
        }
        
        // Reset deleted images when loading fresh data
        setDeletedImageIds([]);
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error("Failed to fetch article data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNewLinkChange = (e) => {
    const { name, value } = e.target;
    setNewLink((prev) => ({ ...prev, [name]: value }));
  };

  const addLink = () => {
    if (!newLink.platform.trim() || !newLink.url.trim()) {
      toast.error("Please enter both platform name and URL");
      return;
    }

    // Validate URL format
    try {
      new URL(newLink.url);
    } catch {
      toast.error("Please enter a valid URL (include http:// or https://)");
      return;
    }

    // Check if platform already exists
    if (formData.links.some(link => link.platform.toLowerCase() === newLink.platform.toLowerCase())) {
      toast.error(`"${newLink.platform}" link already exists`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, { 
        platform: newLink.platform.trim(), 
        url: newLink.url.trim() 
      }]
    }));
    setNewLink({ platform: "", url: "" });
    setErrors((prev) => ({ ...prev, links: "" }));
  };

  const removeLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (file) => {
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, pdf: file }));
      setErrors((prev) => ({ ...prev, pdf: "" }));
    } else {
      setErrors((prev) => ({ ...prev, pdf: "Please select a valid PDF file" }));
    }
  };

  const handleImageChange = (files) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    const validFiles = Array.from(files).filter(file => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Only JPG, PNG, WEBP are allowed.`);
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setFormData((prev) => ({ 
        ...prev, 
        images: [...prev.images, ...validFiles] 
      }));
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    
    // Extract image ID or filename from the URL
    // Assuming the image URL format includes an ID or filename
    // Adjust this logic based on your actual image URL structure
    const imageIdentifier = imageToRemove.split('/').pop(); // Gets the last part of the URL
    
    setDeletedImageIds((prev) => [...prev, imageIdentifier]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleImageChange(e.dataTransfer.files);
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, pdf: null }));
  };

  const removeExistingPdf = () => {
    setExistingPdf(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    else if (formData.description.length < 50) newErrors.description = "Description should be at least 50 characters";
    
    // For PDF, require either existing PDF or new upload
    if (!formData.pdf && !existingPdf) newErrors.pdf = "PDF file is required";
    
    // For images, require either existing images or new uploads
    if (formData.images.length === 0 && existingImages.length === 0) newErrors.images = "At least one image is required";
    
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
      submissionData.append("is_free", formData.is_free);
      
      // Append PDF if it's a new file
      if (formData.pdf) {
        submissionData.append("pdf", formData.pdf);
      } else if (!existingPdf) {
        // If no PDF and no existing PDF, this should have been caught by validation
        throw new Error("PDF file is required");
      }
      
      // Append all new images
      formData.images.forEach((image, index) => {
        submissionData.append(`images[${index}]`, image);
      });

      // Append links as individual form fields
      formData.links.forEach((link, index) => {
        submissionData.append(`links[${index}][platform]`, link.platform);
        submissionData.append(`links[${index}][url]`, link.url);
      });

      // For update, we need to handle existing images and PDF
      if (isUpdateMode) {
        // Send the list of images to keep (existing images that weren't deleted)
        if (existingImages.length > 0) {
          submissionData.append("existing_images", JSON.stringify(existingImages));
        }
        
        // Send the list of deleted image IDs
        if (deletedImageIds.length > 0) {
          submissionData.append("deleted_images", JSON.stringify(deletedImageIds));
        }
        
        // If there's an existing PDF, we need to indicate we're keeping it
        if (existingPdf && !formData.pdf) {
          submissionData.append("keep_existing_pdf", "1");
        }
      }

      let response;
      if (isUpdateMode) {
        // Update existing article
        response = await axios.post(`${apiUrl}article-update/${updateId}`, submissionData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Article updated successfully!");
      } else {
        // Create new article
        response = await axios.post(`${apiUrl}articles`, submissionData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Article created successfully!");
      }

      if (response.status === 200) {
        // Reset form and navigate back
        setFormData({
          title: "",
          description: "",
          is_free: 1,
          pdf: null,
          images: [],
          links: [],
        });
        setExistingImages([]);
        setExistingPdf(null);
        setDeletedImageIds([]);
        setErrors({});
        
        // Navigate back to articles list
        navigate("/admin/landing-page/published-book");
      }
    } catch (error) {
      console.error("Error details:", error);
      
      if (error.response) {
        console.error("Server response:", error.response.data);
        console.error("Server errors:", error.response.data?.errors);
        
        if (error.response.data?.errors) {
          const serverErrors = error.response.data.errors;
          setErrors(serverErrors);
          Object.values(serverErrors).forEach(errorMsg => {
            toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
          });
        } else {
          toast.error(error.response.data?.message || `Failed to ${isUpdateMode ? "update" : "create"} article`);
        }
      } else if (error.request) {
        toast.error("No response from server. Check your connection.");
      } else {
        toast.error("Request failed: " + error.message);
      }
    } finally {
      setHandleSubmitLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/landing-page/published-book");
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Book data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 ${isUpdateMode ? "bg-green-600" : "bg-blue-600"} rounded-lg flex items-center justify-center`}>
              {isUpdateMode ? <Edit className="w-6 h-6 text-white" /> : <Plus className="w-6 h-6 text-white" />}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isUpdateMode ? `Edit Book #${updateId}` : "Add New Book"}
            </h1>
          </div>
          <p className="text-gray-600">
            {isUpdateMode ? "Update your article details" : "Create and publish a new article for your audience"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              Book Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter your article title..."
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
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
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
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
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
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

          {/* Pricing Toggle */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Pricing
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer group flex-1 p-4 border-2 rounded-lg transition-all hover:border-blue-200">
                <input
                  type="radio"
                  name="is_free"
                  checked={formData.is_free === 1}
                  onChange={() => setFormData((prev) => ({ ...prev, is_free: 1 }))}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex-1">
                  <span className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                    Free Book
                  </span>
                  <p className="text-sm text-gray-500">Available to all users</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group flex-1 p-4 border-2 rounded-lg transition-all hover:border-blue-200">
                <input
                  type="radio"
                  name="is_free"
                  checked={formData.is_free === 0}
                  onChange={() => setFormData((prev) => ({ ...prev, is_free: 0 }))}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex-1">
                  <span className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                    Premium Book
                  </span>
                  <p className="text-sm text-gray-500">Requires subscription</p>
                </div>
              </label>
            </div>
          </div>

          {/* Links Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <Link className="w-5 h-5 text-blue-600" />
              External Links ({formData.links.length} added)
            </label>
            <p className="text-gray-600 mb-4">Add links to Amazon, Flipkart, social media, or any other platforms</p>

            {/* Add New Link Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Name *
                </label>
                <input
                  type="text"
                  name="platform"
                  value={newLink.platform}
                  onChange={handleNewLinkChange}
                  placeholder="e.g., Amazon, Facebook, Website..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="url"
                    value={newLink.url}
                    onChange={handleNewLinkChange}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addLink}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Links List */}
            {formData.links.length > 0 ? (
              <div className="space-y-3">
                {formData.links.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <div>
                        <span className="font-medium text-blue-900 capitalize">{link.platform}</span>
                        <p className="text-sm text-blue-700 truncate max-w-xs">{link.url}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Link className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No links added yet</p>
                <p className="text-sm">Add platforms where users can find or purchase this Book</p>
              </div>
            )}
          </div>

          {/* Multiple Images Upload Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <Image className="w-5 h-5 text-blue-600" />
              Book Images ({formData.images.length + existingImages.length} selected)
            </label>

            {/* Existing Images Display */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Existing Images:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {existingImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="mt-1 text-xs text-gray-500 truncate">
                        Existing Image {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload */}
            {formData.images.length === 0 && existingImages.length === 0 ? (
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
                  imageDragActive
                    ? "border-blue-500 bg-blue-50"
                    : errors.images
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
                  accept=".jpg,.jpeg,.png,.webp"
                  multiple
                  onChange={(e) => handleImageChange(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <Image className={`mx-auto w-12 h-12 mb-4 ${imageDragActive ? "text-blue-600" : "text-gray-400"}`} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop your images here</h3>
                  <p className="text-gray-600 mb-4">or click to browse files</p>
                  <p className="text-sm text-gray-500 mb-4">Supports JPG, PNG, WEBP (max 5MB each)</p>
                  <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Choose Images
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Upload new images area */}
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                    imageDragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleImageDrag}
                  onDragLeave={handleImageDrag}
                  onDragOver={handleImageDrag}
                  onDrop={handleImageDrop}
                >
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    multiple
                    onChange={(e) => handleImageChange(e.target.files)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    <Plus className="mx-auto w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-gray-600">Click or drag to add more images</p>
                  </div>
                </div>

                {/* New Image Previews */}
                {formData.images.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">New Images:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="mt-1 text-xs text-gray-500 truncate">
                            {image.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {errors.images && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.images}
              </p>
            )}
          </div>

          {/* PDF Upload Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <Upload className="w-5 h-5 text-blue-600" />
              Upload PDF
            </label>

            {/* Existing PDF Display */}
            {existingPdf && !formData.pdf && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Existing PDF:</h4>
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Current PDF File</p>
                      <p className="text-sm text-blue-700">Click to view</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={existingPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </a>
                    <button
                      type="button"
                      onClick={removeExistingPdf}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* New PDF Upload */}
            {!formData.pdf ? (
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {existingPdf ? "Upload new PDF to replace existing" : "Drop your PDF file here"}
                  </h3>
                  <p className="text-gray-600 mb-4">or click to browse files</p>
                  <div className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Choose File
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
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

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={handleSubmitLoading}
              className={`inline-flex items-center gap-2 px-8 py-3 font-semibold rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all ${
                handleSubmitLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : isUpdateMode
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {handleSubmitLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {isUpdateMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {isUpdateMode ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  {isUpdateMode ? "Update Book" : "Create Book"}
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
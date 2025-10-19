import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Upload,
  FileText,
  DollarSign,
  Plus,
  X,
  Image,
  Trash2,
  Link,
  Globe,
  Edit,
  Eye,
  Search,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import CustomTextEditor from "../../cmponent/common/TextEditor";

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
    title_seo: "",
    description: "",
    description_seo: "",
    is_free: 1,
    pdf: null,
    images: [], // This will contain objects with image_url and image_alts
    links: [],
  });
  const [existingPdf, setExistingPdf] = useState(null);
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
        
        // Transform the images data to match the required structure (same as banner)
        let transformedImages = [];
        if (data.images && Array.isArray(data.images)) {
          transformedImages = data.images.map((img, index) => {
            // Handle different possible image object structures
            if (typeof img === "string") {
              return {
                image_url: img,
                image_alts: "",
              };
            } else if (typeof img === "object") {
              return {
                image_url: img.image_url || img.url || img.path || img.src || "",
                image_alts: img.image_alts || img.alt || img.caption || "",
              };
            }
            return {
              image_url: "",
              image_alts: "",
            };
          });
        }

        setFormData({
          title: data.title || "",
          title_seo: data.title_seo || "",
          description: data.description || "",
          description_seo: data.description_seo || "",
          is_free: data.is_free === "0" ? 0 : 1,
          pdf: null,
          images: transformedImages,
          links: data.links || [],
        });

        // Set existing PDF for display
        if (data.pdf_path) {
          setExistingPdf(data.pdf_path);
        }
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
    if (
      formData.links.some(
        (link) => link.platform.toLowerCase() === newLink.platform.toLowerCase()
      )
    ) {
      toast.error(`"${newLink.platform}" link already exists`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      links: [
        ...prev.links,
        {
          platform: newLink.platform.trim(),
          url: newLink.url.trim(),
        },
      ],
    }));
    setNewLink({ platform: "", url: "" });
    setErrors((prev) => ({ ...prev, links: "" }));
  };

  const removeLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
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
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = Array.from(files).filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          `Invalid file type: ${file.name}. Only JPG, PNG, WEBP are allowed.`
        );
        return false;
      }
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      // Create image objects with the same structure as banner component
      const newImageObjects = validFiles.map((file) => ({
        file: file,
        image_url: URL.createObjectURL(file),
        image_alts: "", // Empty alt text by default
        isNew: true, // Mark as new image
      }));

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImageObjects],
      }));
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  // Handle alt text change for specific image (same as banner)
  const handleImageAltChange = (index, altText) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = {
        ...updatedImages[index],
        image_alts: altText,
      };
      return {
        ...prev,
        images: updatedImages,
      };
    });
  };

  const removeImage = (index) => {
    const imageToRemove = formData.images[index];

    // Revoke object URL for new images to avoid memory leaks (same as banner)
    if (imageToRemove.image_url && imageToRemove.image_url.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.image_url);
    }

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
    if (!formData.title_seo.trim())
      newErrors.title_seo = "SEO Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    else if (formData.description.length < 50)
      newErrors.description = "Description should be at least 50 characters";
    if (!formData.description_seo.trim())
      newErrors.description_seo = "SEO Description is required";

    // For PDF, require either existing PDF or new upload
    if (!formData.pdf && !existingPdf) {
      newErrors.pdf = "PDF file is required";
    }

    // For images, require either existing images or new uploads
    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

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
      submissionData.append("title_seo", formData.title_seo);
      submissionData.append("description", formData.description);
      submissionData.append("description_seo", formData.description_seo);
      submissionData.append("is_free", formData.is_free);

      // Append PDF if it's a new file
      if (formData.pdf) {
        submissionData.append("pdf", formData.pdf);
      } else if (!existingPdf) {
        throw new Error("PDF file is required");
      }

      // Append images with the same structure as banner component
      formData.images.forEach((img, index) => {
        if (img.file) {
          // For new images, append the file directly
          submissionData.append(`images[${index}][image_url]`, img.file);
          submissionData.append(`images[${index}][image_alts]`, img.image_alts || "");
        } else {
          // For existing images, append URL and alt text
          submissionData.append(`images[${index}][image_url]`, img.image_url);
          submissionData.append(`images[${index}][image_alts]`, img.image_alts || "");
        }
      });

      // Append links as individual form fields
      formData.links.forEach((link, index) => {
        submissionData.append(`links[${index}][platform]`, link.platform);
        submissionData.append(`links[${index}][url]`, link.url);
      });

      // If there's an existing PDF and we're not uploading a new one, indicate we're keeping it
      if (isUpdateMode && existingPdf && !formData.pdf) {
        submissionData.append("keep_existing_pdf", "1");
      }

      console.log("FormData entries:");
      for (const pair of submissionData.entries()) {
        console.log(pair[0], pair[1]);
      }

      let response;
      if (isUpdateMode) {
        response = await axios.post(
          `${apiUrl}article-update/${updateId}`,
          submissionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Article updated successfully!");
      } else {
        response = await axios.post(`${apiUrl}articles`, submissionData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Article created successfully!");
      }

      if (response.status === 200) {
        // Clean up object URLs before navigating
        formData.images.forEach((img) => {
          if (img.image_url && img.image_url.startsWith("blob:")) {
            URL.revokeObjectURL(img.image_url);
          }
        });

        navigate("/admin/landing-page/published-book");
      }
    } catch (error) {
      console.error("Error details:", error);

      if (error.response) {
        if (error.response.data?.errors) {
          const serverErrors = error.response.data.errors;
          setErrors(serverErrors);
          Object.values(serverErrors).forEach((errorMsg) => {
            toast.error(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
          });
        } else {
          toast.error(
            error.response.data?.message ||
              `Failed to ${isUpdateMode ? "update" : "create"} article`
          );
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
    // Clean up object URLs to avoid memory leaks (same as banner)
    formData.images.forEach((img) => {
      if (img.image_url && img.image_url.startsWith("blob:")) {
        URL.revokeObjectURL(img.image_url);
      }
    });
    navigate("/admin/landing-page/published-book");
  };

  // Clean up object URLs when component unmounts (same as banner)
  useEffect(() => {
    return () => {
      formData.images.forEach((img) => {
        if (img.image_url && img.image_url.startsWith("blob:")) {
          URL.revokeObjectURL(img.image_url);
        }
      });
    };
  }, [formData.images]);

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
            <div
              className={`w-10 h-10 ${
                isUpdateMode ? "bg-green-600" : "bg-blue-600"
              } rounded-lg flex items-center justify-center`}
            >
              {isUpdateMode ? (
                <Edit className="w-6 h-6 text-white" />
              ) : (
                <Plus className="w-6 h-6 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isUpdateMode ? `Edit Book #${updateId}` : "Add New Book"}
            </h1>
          </div>
          <p className="text-gray-600">
            {isUpdateMode
              ? "Update your article details"
              : "Create and publish a new article for your audience"}
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
                errors.title
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              } focus:outline-none`}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* SEO Title Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <Search className="w-5 h-5 text-blue-600" />
              SEO Title
            </label>
            <input
              type="text"
              name="title_seo"
              value={formData.title_seo}
              onChange={handleInputChange}
              placeholder="Enter SEO title for search engines..."
              className={`w-full px-4 py-3 rounded-lg border transition-colors ${
                errors.title_seo
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              } focus:outline-none`}
            />
            {errors.title_seo && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.title_seo}
              </p>
            )}
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <FileText className="w-5 h-5 text-blue-600" />
              Description
            </label>
            <CustomTextEditor
              value={formData.description}
              onChange={(newContent) =>
                setFormData((prev) => ({
                  ...prev,
                  description: newContent,
                }))
              }
              placeholder="Write a compelling description for your article..."
              height={400}
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
              <span
                className={`text-sm ${
                  formData.description.length < 50
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {formData.description.length} characters
              </span>
            </div>
          </div>

          {/* SEO Description Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <Search className="w-5 h-5 text-blue-600" />
              SEO Description
            </label>
            <textarea
              name="description_seo"
              value={formData.description_seo}
              onChange={handleInputChange}
              placeholder="Enter SEO description for search engines..."
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border transition-colors resize-none ${
                errors.description_seo
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500"
              } focus:outline-none`}
            />
            {errors.description_seo && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.description_seo}
              </p>
            )}
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
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, is_free: 1 }))
                  }
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <div className="flex-1">
                  <span className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                    Free Book
                  </span>
                  <p className="text-sm text-gray-500">
                    Available to all users
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group flex-1 p-4 border-2 rounded-lg transition-all hover:border-blue-200">
                <input
                  type="radio"
                  name="is_free"
                  checked={formData.is_free === 0}
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, is_free: 0 }))
                  }
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
            <p className="text-gray-600 mb-4">
              Add links to Amazon, Flipkart, social media, or any other
              platforms
            </p>

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
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <div>
                        <span className="font-medium text-blue-900 capitalize">
                          {link.platform}
                        </span>
                        <p className="text-sm text-blue-700 truncate max-w-xs">
                          {link.url}
                        </p>
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
                <p className="text-sm">
                  Add platforms where users can find or purchase this Book
                </p>
              </div>
            )}
          </div>

          {/* Multiple Images Upload Section - Updated */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <Image className="w-5 h-5 text-blue-600" />
              Book Images ({formData.images.length} selected)
            </label>

            {/* Images Display */}
            {formData.images.length === 0 ? (
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
                  <Image
                    className={`mx-auto w-12 h-12 mb-4 ${
                      imageDragActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Drop your images here
                  </h3>
                  <p className="text-gray-600 mb-4">or click to browse files</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Supports JPG, PNG, WEBP (max 5MB each)
                  </p>
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
                    <p className="text-gray-600">
                      Click or drag to add more images
                    </p>
                  </div>
                </div>

                {/* Image Previews with Alt Text Input - Updated like banner */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Selected Images ({formData.images.length})
                  </h4>
                  <div className="space-y-4">
                    {formData.images.map((image, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex space-x-3">
                          {/* Image Preview */}
                          <div className="relative flex-shrink-0">
                            <img
                              src={image.image_url}
                              alt={`Preview ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-md border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-90 hover:opacity-100 transition-opacity duration-200"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                              {image.isNew ? "New" : "Existing"}
                            </div>
                          </div>

                          {/* Alt Text Input */}
                          <div className="flex-grow">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Alt Text for SEO (Image {index + 1})
                            </label>
                            <input
                              type="text"
                              value={image.image_alts || ""}
                              onChange={(e) =>
                                handleImageAltChange(index, e.target.value)
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Enter descriptive alt text for SEO"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Describe this image for accessibility and SEO
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Existing PDF:
                </h4>
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">
                        Current PDF File
                      </p>
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
                  <Upload
                    className={`mx-auto w-12 w-12 mb-4 ${
                      dragActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {existingPdf
                      ? "Upload new PDF to replace existing"
                      : "Drop your PDF file here"}
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
                    <p className="font-medium text-green-900">
                      {formData.pdf.name}
                    </p>
                    <p className="text-sm text-green-700">
                      {(formData.pdf.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
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
                  {isUpdateMode ? (
                    <Edit className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
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
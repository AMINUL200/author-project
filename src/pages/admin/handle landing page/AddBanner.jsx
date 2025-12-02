import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../cmponent/common/Loader";
import CustomTextEditor from "../../../cmponent/common/TextEditor";

const AddBanner = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters
  const searchParams = new URLSearchParams(location.search);
  const updateId = searchParams.get("update");
  const isUpdateMode = Boolean(updateId);

  const [loading, setLoading] = useState(true);
  const [handleLoading, setHandleLoading] = useState(false);
  const [bannerData, setBannerData] = useState({
    heading1: "",
    heading2: "",
    description: "",
    button_name: "",
    image_title: "",
    image_subtitle: "",
    images: [], // Unified structure: { file?, image_url, image_alts, isNew? }
  });

  // Cleanup function for blob URLs
  const cleanupBlobUrls = useCallback(() => {
    bannerData.images.forEach((img) => {
      if (img.isNew && img.image_url && img.image_url.startsWith("blob:")) {
        URL.revokeObjectURL(img.image_url);
      }
    });
  }, [bannerData.images]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanupBlobUrls;
  }, [cleanupBlobUrls]);

  // Fetch banner data when in update mode
  useEffect(() => {
    if (isUpdateMode && updateId) {
      fetchBannerData();
    } else {
      setLoading(false);
    }
  }, [isUpdateMode, updateId]);

  const fetchBannerData = async () => {
    try {
      const response = await axios.get(`${apiUrl}banner-edit/${updateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          t: Date.now(), // prevent caching
        },
      });

      console.log("API Response:", response);
      if (response.status === 200) {
        const data = response.data.data;

        // console.log("API Response:", data);
        // console.log("Images data:", data.images);

        // Normalize images data to unified structure
        const normalizedImages = (data.images || []).map((img) => {
          if (typeof img === "string") {
            return {
              image_url: img,
              image_alts: "",
            };
          } else if (typeof img === "object") {
            return {
              image_url: img.image || img.url || img.path || img.src || "",
              image_alts: img.image_alts || img.alt || img.caption || "",
            };
          }
          return {
            image_url: "",
            image_alts: "",
          };
        });

        setBannerData({
          heading1: data.heading1 || "",
          heading2: data.heading2 || "",
          description: data.description || "",
          button_name: data.button_name || "",
          image_title: data.image_title || "",
          image_subtitle: data.image_subtitle || "",
          images: normalizedImages,
        });
      }
    } catch (error) {
      console.error("Error fetching banner:", error);
      toast.error("Failed to fetch banner data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBannerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isValidType) {
        toast.error(`File ${file.name} is not a valid image type`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`File ${file.name} exceeds 10MB size limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newImages = validFiles.map((file) => ({
      file: file, // Store the actual File object
      image_url: URL.createObjectURL(file), // For preview
      image_alts: "", // Empty alt text by default
      isNew: true, // Mark as new image for backend processing
    }));

    setBannerData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    // Clear the file input to allow selecting the same file again
    e.target.value = "";
  };

  // Handle alt text change for specific image
  const handleAltTextChange = (index, altText) => {
    setBannerData((prev) => {
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
    const imageToRemove = bannerData.images[index];

    // Revoke object URL for new images to avoid memory leaks
    if (
      imageToRemove.isNew &&
      imageToRemove.image_url &&
      imageToRemove.image_url.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imageToRemove.image_url);
    }

    // Remove from banner data
    setBannerData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  const validateForm = () => {
    if (!bannerData.heading1.trim()) {
      toast.error("Heading 1 is required");
      return false;
    }
    if (!bannerData.heading2.trim()) {
      toast.error("Heading 2 is required");
      return false;
    }
    if (!bannerData.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!bannerData.button_name.trim()) {
      toast.error("Button text is required");
      return false;
    }
    if (!bannerData.image_title.trim()) {
      toast.error("Image title is required");
      return false;
    }
    if (!bannerData.image_subtitle.trim()) {
      toast.error("Image subtitle is required");
      return false;
    }
    if (bannerData.images.length === 0) {
      toast.error("At least one image is required");
      return false;
    }

    // Validate alt texts (optional but recommended for SEO)
    const imagesWithoutAlt = bannerData.images.filter(
      (img) => !img.image_alts.trim()
    );
    if (imagesWithoutAlt.length > 0) {
      toast.warning(
        "Some images are missing alt text. This affects SEO and accessibility."
      );
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setHandleLoading(true);

    try {
      const formData = new FormData();

      // Append all text fields
      formData.append("heading1", bannerData.heading1);
      formData.append("heading2", bannerData.heading2);
      formData.append("description", bannerData.description);
      formData.append("button_name", bannerData.button_name);
      formData.append("image_title", bannerData.image_title);
      formData.append("image_subtitle", bannerData.image_subtitle);

      // Append images with clear structure
      bannerData.images.forEach((img, index) => {
        if (img.isNew && img.file) {
          // For new images, append the file and mark as new
          formData.append(`images[${index}][file]`, img.file);
          formData.append(`images[${index}][alt]`, img.image_alts || "");
          formData.append(`images[${index}][type]`, "new");
        } else {
          // For existing images, append URL and alt text
          formData.append(`images[${index}][url]`, img.image_url);
          formData.append(`images[${index}][alt]`, img.image_alts || "");
          formData.append(`images[${index}][type]`, "existing");
        }
      });

      // Add metadata for better backend processing
      formData.append("total_images", bannerData.images.length.toString());
      formData.append("is_update_mode", isUpdateMode.toString());

      console.log("FormData entries:");
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      let response;
      if (isUpdateMode) {
        response = await axios.post(
          `${apiUrl}banner-update/${updateId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Update response:", response);

        if (response.status === 200) {
          toast.success("Banner updated successfully!");
          cleanupBlobUrls();
          navigate("/admin/landing-page/banners");
        }
      } else {
        response = await axios.post(`${apiUrl}banner`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Create response:", response);

        if (response.status === 201 || response.status === 200) {
          toast.success("Banner created successfully!");
          cleanupBlobUrls();
          navigate("/admin/landing-page/banners");
        }
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 422 && data.errors) {
          Object.entries(data.errors).forEach(([key, val]) =>
            toast.error(`${key}: ${val[0]}`)
          );
        } else if (status === 500) {
          toast.error("Server error — please check backend logs.");
        } else {
          toast.error(`Error: ${status} - ${data.message || "Unknown error"}`);
        }
      } else if (error.request) {
        toast.error("Network error - please check your connection.");
      } else {
        toast.error(`Failed to ${isUpdateMode ? "update" : "create"} banner`);
      }
    } finally {
      setHandleLoading(false);
    }
  };

  const handleCancel = () => {
    cleanupBlobUrls();
    navigate("/admin/landing-page/banners");
  };

  // Calculate total size of new images
  const getTotalNewImageSize = () => {
    return bannerData.images
      .filter((img) => img.isNew && img.file)
      .reduce((total, img) => total + img.file.size, 0);
  };

  const totalNewImageSizeMB = (getTotalNewImageSize() / (1024 * 1024)).toFixed(
    2
  );

  if (loading && isUpdateMode) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isUpdateMode ? `Edit Banner #${updateId}` : "Add New Banner"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isUpdateMode
              ? "Update your banner details"
              : "Create a new banner for your website"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Text Fields */}
              <div className="space-y-6">
                {/* Heading 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heading 1 *
                  </label>
                  <input
                    type="text"
                    name="heading1"
                    value={bannerData.heading1}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter main heading"
                  />
                </div>

                {/* Heading 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heading 2 *
                  </label>
                  <input
                    type="text"
                    name="heading2"
                    value={bannerData.heading2}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter sub heading"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <CustomTextEditor
                    value={bannerData.description}
                    onChange={(newContent) =>
                      setBannerData((prev) => ({
                        ...prev,
                        description: newContent,
                      }))
                    }
                    placeholder="Enter banner description"
                    height={150}
                  />
                </div>

                {/* Button Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Text *
                  </label>
                  <input
                    type="text"
                    name="button_name"
                    value={bannerData.button_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter button text"
                  />
                </div>
              </div>

              {/* Right Column - Image Fields */}
              <div className="space-y-6">
                {/* Image Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Title *
                  </label>
                  <input
                    type="text"
                    name="image_title"
                    value={bannerData.image_title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter image title"
                  />
                </div>

                {/* Image Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Subtitle *
                  </label>
                  <input
                    type="text"
                    name="image_subtitle"
                    value={bannerData.image_subtitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter image subtitle"
                  />
                </div>

                {/* Multiple Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Images *
                  </label>

                  {/* Image Statistics */}
                  {bannerData.images.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-700 font-medium">
                          {bannerData.images.length} image(s) selected
                        </span>
                        {totalNewImageSizeMB > 0 && (
                          <span className="text-blue-600">
                            New images: {totalNewImageSizeMB} MB
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-blue-600">
                        {bannerData.images.filter(
                          (img) => !img.image_alts.trim()
                        ).length > 0 && (
                          <p>⚠️ Some images are missing alt text</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Image Previews with Alt Text Input */}
                  {bannerData.images.length > 0 && (
                    <div className="mb-4 space-y-4">
                      {bannerData.images.map((img, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-3 bg-gray-50"
                        >
                          <div className="flex space-x-3">
                            {/* Image Preview */}
                            <div className="relative flex-shrink-0">
                              <img
                                src={img.image_url}
                                alt={`Preview ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-md border"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-90 hover:opacity-100 transition-opacity duration-200 shadow-md"
                              >
                                ×
                              </button>
                              <div
                                className={`absolute bottom-0 left-0 right-0 text-white text-xs p-1 text-center ${
                                  img.isNew ? "bg-green-600" : "bg-blue-600"
                                }`}
                              >
                                {img.isNew ? "New" : "Existing"}
                              </div>
                              {img.isNew && img.file && (
                                <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 text-center">
                                  {(img.file.size / (1024 * 1024)).toFixed(1)}MB
                                </div>
                              )}
                            </div>

                            {/* Alt Text Input */}
                            <div className="flex-grow">
                              <label className="block text-xs font-medium text-gray-600 mb-1">
                                Alt Text for SEO (Image {index + 1})
                                {!img.image_alts.trim() && (
                                  <span className="text-red-500 ml-1">
                                    * Recommended
                                  </span>
                                )}
                              </label>
                              <input
                                type="text"
                                value={img.image_alts}
                                onChange={(e) =>
                                  handleAltTextChange(index, e.target.value)
                                }
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Describe this image for accessibility and SEO"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Helps with SEO and accessibility for visually
                                impaired users
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Area */}
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-400 transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload files</span>
                          <input
                            id="image-upload"
                            name="images"
                            type="file"
                            className="sr-only"
                            onChange={handleImageChange}
                            accept="image/*"
                            multiple
                            required={
                              !isUpdateMode && bannerData.images.length === 0
                            }
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                      <p className="text-xs text-gray-500">
                        You can select multiple images
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={handleLoading}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={handleLoading}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {handleLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    {isUpdateMode ? "Updating..." : "Creating..."}
                  </span>
                ) : isUpdateMode ? (
                  "Update Banner"
                ) : (
                  "Create Banner"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBanner;

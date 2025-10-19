import React, { useState, useEffect } from "react";
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
  const [imagePreviews, setImagePreviews] = useState([]);
  const [bannerData, setBannerData] = useState({
    heading1: "",
    heading2: "",
    description: "",
    button_name: "",
    image_title: "",
    image_subtitle: "",
    images: [], // This will contain objects with image_url and image_alts
  });

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
      });

      if (response.status === 200) {
        const data = response.data;

        console.log("API Response:", data);
        console.log("Images data:", data.images);

        // Transform the images data to match the required structure
        let transformedImages = [];
        if (data.images && Array.isArray(data.images)) {
          transformedImages = data.images.map((img) => {
            // Handle different possible image object structures
            if (typeof img === "string") {
              return {
                image_url: img,
                image_alts: "",
              };
            } else if (typeof img === "object") {
              return {
                image_url:
                  img.image_url || img.url || img.path || img.src || "",
                image_alts: img.image_alts || img.alt || img.caption || "",
              };
            }
            return {
              image_url: "",
              image_alts: "",
            };
          });
        }

        setBannerData({
          heading1: data.heading1 || "",
          heading2: data.heading2 || "",
          description: data.description || "",
          button_name: data.button_name || "",
          image_title: data.image_title || "",
          image_subtitle: data.image_subtitle || "",
          images: transformedImages,
        });

        // Set image previews for existing images
        if (transformedImages.length > 0) {
          setImagePreviews(
            transformedImages.map((img) => ({
              preview: img.image_url,
              alt: img.image_alts,
              isExisting: true,
            }))
          );
        }
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

    if (files.length > 0) {
      // Create preview URLs and image objects for new files
      const newImageObjects = files.map((file) => ({
        file: file,
        image_url: URL.createObjectURL(file),
        image_alts: "", // Empty alt text by default, user can fill later
        isNew: true, // Mark as new image
      }));

      // Update previews state
      setImagePreviews((prev) => [
        ...prev,
        ...newImageObjects.map((img) => ({
          preview: img.image_url,
          alt: img.image_alts,
          isExisting: false,
        })),
      ]);

      // Update banner data with new image objects
      setBannerData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImageObjects],
      }));
    }

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

    // Also update previews for display
    setImagePreviews((prev) => {
      const updatedPreviews = [...prev];
      updatedPreviews[index] = {
        ...updatedPreviews[index],
        alt: altText,
      };
      return updatedPreviews;
    });
  };

  const removeImage = (index) => {
    const imageToRemove = bannerData.images[index];

    // Revoke object URL for new images to avoid memory leaks
    if (
      imageToRemove.image_url &&
      imageToRemove.image_url.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imageToRemove.image_url);
    }

    // Remove from previews
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      // Append each image file directly to the images array
      bannerData.images.forEach((img, index) => {
        if (img.file) {
          // For new images, append the file directly
          formData.append(`images[${index}][image_url]`, img.file);
          formData.append(`images[${index}][image_alts]`, img.image_alts || "");
        } else {
          // For existing images, append URL and alt text
          formData.append(`images[${index}][image_url]`, img.image_url);
          formData.append(`images[${index}][image_alts]`, img.image_alts || "");
        }
      });

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
        console.log(response);
        
        toast.success("Banner updated successfully!");
      } else {
        response = await axios.post(`${apiUrl}banner`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response);
        
        toast.success("Banner created successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        navigate("/admin/landing-page/banners");
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
      } else {
        toast.error(`Failed to ${isUpdateMode ? "update" : "create"} banner`);
      }
    } finally {
      setHandleLoading(false);
    }
  };

  const handleCancel = () => {
    // Clean up object URLs to avoid memory leaks
    imagePreviews.forEach((preview) => {
      if (preview.preview && preview.preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview.preview);
      }
    });
    navigate("/admin/landing-page/banners");
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.preview && preview.preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview.preview);
        }
      });
    };
  }, [imagePreviews]);

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
                    height={50}
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

                  {/* Image Previews with Alt Text Input */}
                  {imagePreviews.length > 0 && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selected Images ({imagePreviews.length})
                      </label>
                      <div className="space-y-4">
                        {imagePreviews.map((preview, index) => (
                          <div
                            key={index}
                            className="border rounded-lg p-3 bg-gray-50"
                          >
                            <div className="flex space-x-3">
                              {/* Image Preview */}
                              <div className="relative flex-shrink-0">
                                <img
                                  src={preview.preview}
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
                                  {preview.isExisting ? "Existing" : "New"}
                                </div>
                              </div>

                              {/* Alt Text Input */}
                              <div className="flex-grow">
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Alt Text for SEO (Image {index + 1})
                                </label>
                                <input
                                  type="text"
                                  value={
                                    bannerData.images[index]?.image_alts || ""
                                  }
                                  onChange={(e) =>
                                    handleAltTextChange(index, e.target.value)
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
                  )}

                  {/* Upload Area */}
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                              !isUpdateMode && imagePreviews.length === 0
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
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={handleLoading}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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

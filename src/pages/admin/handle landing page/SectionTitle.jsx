import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

const SectionTitle = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [handleLoading, setHandleLoading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [formData, setFormData] = useState({
    sec1_first_title: null,
    sec1_card1_title: null,
    sec1_card_para: null,
    sec1_card2_title: null,
    sec1_card2_para: null,
    sec1_main_card_title: null,
    sec1_main_card_para: null,
    sec1_button_name: null,
    sec2_title: null,
    sec2_para: null,
    sec2_button_name: null,
    sec3_name: null,
    sec3_para: null,
    sec4_name: null,
    sec4_para: null,
    sec4_button_name: null,
    sec5_name: null,
    sec5_country_prefix: null,
    sec6_name: null,
    sec6_para: null,
    sec6_message: null,
    sec7_name: null,
    sec7_para: null,
    sec8_name: null,
    sec8_desc: null,
    sec8_button_name: null,
    com_logo: null,
    com_name: null,
    com_description: null,
  });

  const fetchSectionTitle = async () => {
    try {
      const response = await axios.get(`${apiUrl}sections/edit`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        setFormData(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectionTitle();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setLogoUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('logo', file);

      const response = await axios.post(`${apiUrl}sections/upload-logo`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status) {
        const logoUrl = response.data.data.logoUrl;
        setFormData((prev) => ({
          ...prev,
          com_logo: logoUrl,
        }));
        toast.success('Logo uploaded successfully!');
      } else {
        toast.error(response.data.message || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload logo');
    } finally {
      setLogoUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleRemoveLogo = async () => {
    try {
      const response = await axios.delete(`${apiUrl}sections/remove-logo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        setFormData((prev) => ({
          ...prev,
          com_logo: null,
        }));
        toast.success('Logo removed successfully!');
      } else {
        toast.error(response.data.message || 'Failed to remove logo');
      }
    } catch (error) {
      console.error('Logo removal error:', error);
      toast.error(error.response?.data?.message || 'Failed to remove logo');
    }
  };

  const handleSubmit = async () => {
    setHandleLoading(true);
    try {
      const response = await axios.post(`${apiUrl}sections/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        console.log(response.data);
        toast.success("Update Success ");
        fetchSectionTitle();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setHandleLoading(false);
    }
  };

  const formatLabel = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(/Sec(\d+)/g, "Section $1")
      .replace(/Com(\s|_)?/g, "Company ")
      .replace(/Logo/g, "Logo")
      .replace(/Desc/g, "Description");
  };

  const renderInputField = (key, value) => {
    // Skip these fields
    if (key === "id" || key === "created_at" || key === "updated_at") {
      return null;
    }

    // Special handling for logo upload field
    if (key === "com_logo") {
      return (
        <div key={key} className="mb-6">
          <label
            htmlFor={key}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {formatLabel(key)}
          </label>
          
          {/* Logo Preview */}
          {formData[key] && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Current Logo:</p>
              <div className="flex items-center gap-4">
                <img
                  src={formData[key]}
                  alt="Company logo preview"
                  className="h-20 w-20 object-contain border rounded-lg bg-gray-50"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Remove Logo
                </button>
              </div>
            </div>
          )}

          {/* File Upload Input */}
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="logo-upload"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleLogoUpload}
              className="hidden"
              disabled={logoUploading}
            />
            <label
              htmlFor="logo-upload"
              className={`px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors ${
                logoUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {logoUploading ? 'Uploading...' : 'Choose Logo Image'}
            </label>
            <span className="text-sm text-gray-500">
              JPEG, PNG, GIF, WebP (Max 5MB)
            </span>
          </div>
        </div>
      );
    }

    const isParagraph =
      key.includes("para") ||
      key.includes("desc") ||
      key.includes("message") ||
      key === "com_description";

    return (
      <div key={key} className="mb-4">
        <label
          htmlFor={key}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {formatLabel(key)}
        </label>
        {isParagraph ? (
          <textarea
            id={key}
            name={key}
            value={formData[key] || ""}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter ${formatLabel(key).toLowerCase()}`}
          />
        ) : (
          <input
            type="text"
            id={key}
            name={key}
            value={formData[key] || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter ${formatLabel(key).toLowerCase()}`}
          />
        )}
      </div>
    );
  };

  const groupedFields = {};
  Object.keys(formData).forEach((key) => {
    if (key !== "id" && key !== "created_at" && key !== "updated_at") {
      const match = key.match(/^sec(\d+)/);
      let section = match ? `Section ${match[1]}` : "Other";
      
      // Group company fields together
      if (key.startsWith('com_')) {
        section = "Company Information";
      }
      
      if (!groupedFields[section]) {
        groupedFields[section] = [];
      }
      groupedFields[section].push(key);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Section Title Management
        </h1>

        <div>
          {Object.entries(groupedFields).map(([section, fields]) => (
            <div key={section} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 pb-2 border-b-2 border-blue-500">
                {section}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field) =>
                  renderInputField(field, formData[field])
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-4 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={handleLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {handleLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionTitle;
import React, { useEffect, useState, useRef } from "react";
import {
  Pencil,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Camera,
  Upload,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../cmponent/common/Loader";

const AdminProfilePage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null); // Store actual file
  const [imagePreview, setImagePreview] = useState(""); // For preview only
  
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    affiliation: "",
    country: "",
    description: "",
    image: "",
    social_links: {
      twitter: "",
      fb: "",
      linkedin: "",
      instagram: "",
    },
    status: "",
  });

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${apiUrl}authors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(response.status === 200){
        const profileData = response.data.data[0];
        
        // Ensure social_links has all required properties with fallback values
        const socialLinks = profileData.social_links || {};
        const completeSocialLinks = {
          twitter: socialLinks.twitter || "",
          fb: socialLinks.fb || "",
          linkedin: socialLinks.linkedin || "",
          instagram: socialLinks.instagram || "",
        };
        
        setProfile({
          ...profileData,
          social_links: completeSocialLinks
        });
        console.log("Profile Data:", response.data.data[0]);
      }

    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(error?.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  },[])

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("social_")) {
      const key = name.replace("social_", "");
      setProfile((prev) => ({
        ...prev,
        social_links: { 
          ...prev.social_links, 
          [key]: value 
        },
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle image file selection
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB.');
      return;
    }

    try {
      setImageUploading(true);
      
      // Store the actual file for upload
      setSelectedImageFile(file);
      
      // Create preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      toast.success('Image selected! Save your profile to update.');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image.');
    } finally {
      setImageUploading(false);
    }
  };

  // Trigger file input click
  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Use FormData for file upload
      const formData = new FormData();
      
      // Append all profile fields
      formData.append('first_name', profile.first_name || '');
      formData.append('last_name', profile.last_name || '');
      formData.append('email', profile.email || '');
      formData.append('phone', profile.phone || '');
      formData.append('address', profile.address || '');
      formData.append('affiliation', profile.affiliation || '');
      formData.append('country', profile.country || '');
      formData.append('description', profile.description || '');
      
      // Append social links - check if backend expects them as separate fields or JSON
      // If separate fields:
      formData.append('social_twitter', profile.social_links.twitter || '');
      formData.append('social_fb', profile.social_links.fb || '');
      formData.append('social_linkedin', profile.social_links.linkedin || '');
      formData.append('social_instagram', profile.social_links.instagram || '');
      
      // If backend expects JSON string, use this instead:
      // formData.append('social_links', JSON.stringify(profile.social_links));
      
      // Append image file if selected
      if (selectedImageFile) {
        formData.append('image', selectedImageFile);
      }
      
      const response = await axios.post(
        `${apiUrl}authors/${profile.id}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Important for file upload
          },
        }
      );
      
      if(response.status === 200){
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setSelectedImageFile(null);
        setImagePreview("");
        // Refresh the profile data
        fetchProfile();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // Better error handling for validation errors
      if (error?.response?.status === 422 && error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(field => {
          errors[field].forEach(errorMsg => {
            toast.error(`${field}: ${errorMsg}`);
          });
        });
      } else {
        toast.error(error?.response?.data?.message || "Failed to update profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getSocialIcon = (platform) => {
    const icons = {
      twitter: Twitter,
      fb: Facebook,
      linkedin: Linkedin,
      instagram: Instagram,
    };
    return icons[platform] || Globe;
  };

  // Define the social platforms we want to display
  const socialPlatforms = [
    { key: 'twitter', label: 'Twitter' },
    { key: 'fb', label: 'Facebook' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'instagram', label: 'Instagram' }
  ];

  // Clean up preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (loading) {
    return <Loader/>
  }

  // Determine which image to show
  const displayImage = imagePreview || profile?.image;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-pink-600/10 blur-3xl -z-10"></div>
          <div className="border border-gray-200/50 rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg overflow-hidden">
                    {displayImage ? (
                      <img 
                        src={displayImage} 
                        alt="Profile" 
                        className="w-14 h-14 rounded-full object-cover" 
                      />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  
                  {/* Image upload overlay - only show when editing */}
                  {isEditing && (
                    <div 
                      onClick={handleImageClick}
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                    >
                      {imageUploading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera className="w-4 h-4 text-white" />
                      )}
                    </div>
                  )}
                  
                  {/* Status indicator */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                    {profile.first_name} {profile.last_name}
                  </h1>
                  <p className="text-gray-600 font-medium">
                    {profile.affiliation}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600 capitalize font-medium">
                      {profile.status}
                    </span>
                  </div>
                  {/* Image upload hint when editing */}
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      Click image to update
                    </p>
                  )}
                </div>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-2">
                    <Pencil className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                    Edit Profile
                  </div>
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={loading || imageUploading}
                    className="group px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      {loading ? "Saving..." : "Save"}
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setSelectedImageFile(null);
                      setImagePreview("");
                      // Reset profile to original state if user cancels
                      fetchProfile();
                    }}
                    disabled={loading || imageUploading}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      Cancel
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2">
            <div className="border border-gray-200/50 rounded-3xl p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Personal Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ModernInputField
                  label="First Name"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  icon={User}
                />
                <ModernInputField
                  label="Last Name"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  icon={User}
                />
                <ModernInputField
                  label="Email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  icon={Mail}
                />
                <ModernInputField
                  label="Phone"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  icon={Phone}
                />
                <ModernInputField
                  label="Country"
                  name="country"
                  value={profile.country}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  icon={Globe}
                />
                <ModernInputField
                  label="Affiliation"
                  name="affiliation"
                  value={profile.affiliation}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  icon={Building}
                />
              </div>

              <div className="mt-6">
                <ModernInputField
                  label="Address"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  icon={MapPin}
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    name="description"
                    value={profile.description}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full border rounded-2xl px-4 py-3 pr-12 resize-none focus:outline-none transition-all duration-300 ${
                      isEditing
                        ? "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-sm"
                        : "border-gray-200 bg-gray-50/50 cursor-not-allowed"
                    }`}
                    rows="4"
                    placeholder="Tell us about yourself..."
                  />
                  {isEditing && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center">
                      <Pencil className="w-3 h-3 text-blue-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links & Status */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="border border-gray-200/50 rounded-3xl p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl border border-green-200/50 bg-green-50/30">
                  <span className="font-medium text-gray-700">
                    Account Status
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium capitalize">
                    {profile.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="border border-gray-200/50 rounded-3xl p-6 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                Social Links
              </h3>

              <div className="space-y-4">
                {socialPlatforms.map((platform) => {
                  const IconComponent = getSocialIcon(platform.key);
                  return (
                    <div key={platform.key} className="group">
                      <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                        {platform.label}
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                          <IconComponent className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                        </div>
                        <input
                          type="url"
                          name={`social_${platform.key}`}
                          value={profile.social_links[platform.key] || ""}
                          onChange={handleChange}
                          readOnly={!isEditing}
                          className={`w-full border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-all duration-300 ${
                            isEditing
                              ? "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-sm"
                              : "border-gray-200 bg-gray-50/50 cursor-not-allowed"
                          }`}
                          placeholder={`Your ${platform.label} profile URL`}
                        />
                        {isEditing && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModernInputField = ({
  label,
  name,
  value,
  onChange,
  readOnly,
  icon: Icon,
}) => {
  return (
    <div className="group">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
          <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
        </div>
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          readOnly={readOnly}
          className={`w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none transition-all duration-300 ${
            readOnly
              ? "border-gray-200 bg-gray-50/50 cursor-not-allowed"
              : "border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 shadow-sm hover:border-gray-400"
          }`}
          placeholder={`Enter your ${label.toLowerCase()}`}
        />
        {!readOnly && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfilePage;
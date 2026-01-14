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
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  
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
    social_links: [],
    status: "",
  });

  const [socialLinks, setSocialLinks] = useState({
    twitter: "",
    fb: "",
    linkedin: "",
    instagram: "",
  });

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${apiUrl}authors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          t: Date.now(),
        },
      });

      if(response.status === 200){
        const profileData = response.data.data[0];
        
        // Initialize social links from array to object format for easier handling
        let socialLinksObj = {
          twitter: "",
          fb: "",
          linkedin: "",
          instagram: "",
        };
        
        // If social_links is an array, convert it to object format
        if (Array.isArray(profileData.social_links)) {
          // Assuming the array contains objects with platform and url properties
          profileData.social_links.forEach(link => {
            if (link.platform && link.url) {
              socialLinksObj[link.platform] = link.url;
            }
          });
        } else if (typeof profileData.social_links === 'object') {
          // If it's already an object, use it directly
          socialLinksObj = {
            ...socialLinksObj,
            ...profileData.social_links
          };
        }
        
        setProfile(profileData);
        setSocialLinks(socialLinksObj);
        console.log("Profile Data:", profileData);
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
  }, [])

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setSocialLinks(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  // Convert social links object to array format for backend
  const prepareSocialLinksArray = () => {
    const linksArray = [];
    
    // Add only non-empty links to the array
    Object.entries(socialLinks).forEach(([platform, url]) => {
      if (url && url.trim() !== "") {
        linksArray.push({
          platform: platform,
          url: url.trim()
        });
      }
    });
    
    return linksArray;
  };

  // Handle image file selection
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB.');
      return;
    }

    try {
      setImageUploading(true);
      setSelectedImageFile(file);
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

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
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
      
      // Prepare social links as array and convert to JSON string
      const socialLinksArray = prepareSocialLinksArray();
      formData.append('social_links', JSON.stringify(socialLinksArray));
      
      // Append image file if selected
      if (selectedImageFile) {
        formData.append('image', selectedImageFile);
      }

      // Debug: log what we're sending
      console.log("Social links array:", socialLinksArray);
      console.log("Social links JSON:", JSON.stringify(socialLinksArray));
      
      const response = await axios.post(
        `${apiUrl}authors/${profile.id}`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if(response.status === 200){
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setSelectedImageFile(null);
        setImagePreview("");
        fetchProfile();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // Better error handling
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

  // Alternative: If backend expects different format for social_links
  const handleSaveAlternative = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      
      // Append profile fields
      const fields = [
        'first_name', 'last_name', 'email', 'phone', 
        'address', 'affiliation', 'country', 'description'
      ];
      
      fields.forEach(field => {
        formData.append(field, profile[field] || '');
      });
      
      // Option 1: Send as array of objects directly (if backend accepts FormData with arrays)
      const socialLinksArray = prepareSocialLinksArray();
      
      // Try different formats based on what your backend expects:
      
      // Format 1: JSON string (most common)
      // formData.append('social_links', JSON.stringify(socialLinksArray));
      
      // Format 2: If backend expects array format directly
      socialLinksArray.forEach((link, index) => {
        formData.append(`social_links[${index}][platform]`, link.platform);
        formData.append(`social_links[${index}][url]`, link.url);
      });
      
      // Format 3: Simple key-value pairs
      // socialLinksArray.forEach((link, index) => {
      //   formData.append(`social_links[${index}]`, `${link.platform}:${link.url}`);
      // });
      
      if (selectedImageFile) {
        formData.append('image', selectedImageFile);
      }

      // Log for debugging
      console.log("Sending social_links as:", JSON.stringify(socialLinksArray));
      
      const response = await axios({
        method: 'POST',
        url: `${apiUrl}authors/${profile.id}`,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if(response.status === 200){
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        setSelectedImageFile(null);
        setImagePreview("");
        fetchProfile();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Failed to update profile.");
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

  const socialPlatforms = [
    { key: 'twitter', label: 'Twitter' },
    { key: 'fb', label: 'Facebook' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'instagram', label: 'Instagram' }
  ];

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
                  
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  
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
                    onClick={handleSaveAlternative} // Using alternative method
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
                          value={socialLinks[platform.key] || ""}
                          onChange={(e) => handleSocialLinkChange(platform.key, e.target.value)}
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
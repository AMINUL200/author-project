import React, { useState, useEffect } from 'react';
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddEvent = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get('update');
  
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    location_url: '',
    start_time: '',
    end_time: '',
    image: null,
    organizer_name: '',
    guests: [],
    social_links: {}
  });
  const [imagePreview, setImagePreview] = useState('');
  const [newGuest, setNewGuest] = useState({ 
    guest_name: '', 
    guest_image: null, 
    guest_designation: '',
    guest_image_preview: '' 
  });
  const [newSocialLink, setNewSocialLink] = useState({ key: '', url: '' });

  // Fetch event data if in edit mode
  useEffect(() => {
    if (isEdit) {
      fetchEventData();
    }
  }, [isEdit]);

  const fetchEventData = async () => {
    setFormLoading(true);
    try {
      const response = await axios.get(`${apiUrl}events/${isEdit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const event = response.data.data;
        console.log('Fetched event data:', event);
        
        // Format time from "10:00:00" to "10:00" for HTML input
        setFormData({
          title: event.title || '',
          description: event.description || '',
          date: event.date ? event.date.split('T')[0] : '',
          location: event.location || '',
          location_url: event.location_url || '',
          start_time: event.start_time ? event.start_time.substring(0, 5) : '',
          end_time: event.end_time ? event.end_time.substring(0, 5) : '',
          image: null,
          organizer_name: event.organizer_name || '',
          guests: event.guests || [],
          social_links: event.social_links || {}
        });
        setImagePreview(event.image || '');
      }
    } catch (error) {
      console.log('Error fetching event:', error);
      toast.error("Failed to fetch event data");
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF)');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview('');
  };

  // Guest Management
  const handleGuestInputChange = (e) => {
    const { name, value } = e.target;
    setNewGuest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuestImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF)');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size should be less than 10MB');
        return;
      }

      setNewGuest(prev => ({
        ...prev,
        guest_image: file
      }));

      // Create preview for new guest
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewGuest(prev => ({
          ...prev,
          guest_image_preview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addGuest = () => {
    if (!newGuest.guest_name.trim() || !newGuest.guest_designation.trim()) {
      toast.error("Guest name and designation are required");
      return;
    }

    setFormData(prev => ({
      ...prev,
      guests: [...prev.guests, { ...newGuest }]
    }));

    setNewGuest({ 
      guest_name: '', 
      guest_image: null, 
      guest_designation: '',
      guest_image_preview: '' 
    });
  };

  const removeGuest = (index) => {
    setFormData(prev => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index)
    }));
  };

  // Social Links Management
  const handleSocialLinkInputChange = (e) => {
    const { name, value } = e.target;
    setNewSocialLink(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSocialLink = () => {
    if (!newSocialLink.key.trim() || !newSocialLink.url.trim()) {
      toast.error("Social link key and URL are required");
      return;
    }

    // Validate URL format
    try {
      new URL(newSocialLink.url);
    } catch (error) {
      toast.error("Please enter a valid URL");
      return;
    }

    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [newSocialLink.key]: newSocialLink.url
      }
    }));

    setNewSocialLink({ key: '', url: '' });
  };

  const removeSocialLink = (key) => {
    setFormData(prev => {
      const updatedLinks = { ...prev.social_links };
      delete updatedLinks[key];
      return {
        ...prev,
        social_links: updatedLinks
      };
    });
  };

  // Format time for API (ensure it's in H:i format)
  const formatTimeForAPI = (timeString) => {
    if (!timeString) return '';
    
    // If time is already in HH:MM format, add seconds
    if (timeString.match(/^\d{2}:\d{2}$/)) {
      return timeString + ':00';
    }
    
    // If it's in HH:MM:SS format, return as is
    if (timeString.match(/^\d{2}:\d{2}:\d{2}$/)) {
      return timeString;
    }
    
    return timeString;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'date', 'location', 'start_time', 'end_time', 'organizer_name'];
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append all fields with proper formatting
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('date', formData.date);
      submitData.append('location', formData.location);
      submitData.append('organizer_name', formData.organizer_name);
      
      // Format times for API
      submitData.append('start_time', formatTimeForAPI(formData.start_time));
      submitData.append('end_time', formatTimeForAPI(formData.end_time));
      
      if (formData.location_url) {
        submitData.append('location_url', formData.location_url);
      }
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      // Append guests - handle both new images and existing image URLs
      formData.guests.forEach((guest, index) => {
        submitData.append(`guests[${index}][guest_name]`, guest.guest_name);
        submitData.append(`guests[${index}][guest_designation]`, guest.guest_designation);
        
        // Only append guest_image if it's a new file, not if it's an existing URL string
        if (guest.guest_image instanceof File) {
          submitData.append(`guests[${index}][guest_image]`, guest.guest_image);
        } else if (isEdit && guest.guest_image && typeof guest.guest_image === 'string') {
          // For existing images in edit mode, you might want to handle differently
          // Or you can skip if you don't want to update the image
          submitData.append(`guests[${index}][guest_image_url]`, guest.guest_image);
        }
      });

      // Append social links
      Object.entries(formData.social_links).forEach(([key, url]) => {
        submitData.append(`social_links[${key}]`, url);
      });

      // Debug: Log what we're sending
      console.log('Submitting data:');
      console.log('Title:', formData.title);
      console.log('Guests:', formData.guests);
      console.log('Social Links:', formData.social_links);

      let response;
      if (isEdit) {
        // For Laravel, use POST with _method=PUT for file uploads
        // submitData.append('_method', 'PUT');
        response = await axios.post(`${apiUrl}events/${isEdit}`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Create new event
        response = await axios.post(`${apiUrl}events`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(`Event ${isEdit ? 'updated' : 'created'} successfully`);
        navigate('/admin/landing-page/event-list');
      }
    } catch (error) {
      console.log('Full error:', error);
      console.log('Error response:', error.response?.data);
      
      // Show specific validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          toast.error(`${key}: ${errors[key].join(', ')}`);
        });
      } else {
        toast.error(`Failed to ${isEdit ? 'update' : 'create'} event: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/landing-page/event-list');
  };

  // Show loading while fetching event data for editing
  if (isEdit && formLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Event' : 'Create New Event'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isEdit ? 'Update your event details' : 'Fill in the details to create a new event'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow-sm rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image
              </label>
              <div className="flex items-center space-x-6">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, JPEG, GIF up to 10MB
                  </p>
                </div>
                {(imagePreview || formData.image) && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter event title"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter event description"
              />
            </div>

            {/* Date and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter event location"
                />
              </div>
            </div>

            {/* Time Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Time */}
              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  required
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Format: HH:MM (24-hour format)</p>
              </div>

              {/* End Time */}
              <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  type="time"
                  id="end_time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  required
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Format: HH:MM (24-hour format)</p>
              </div>
            </div>

            {/* Organizer Name */}
            <div>
              <label htmlFor="organizer_name" className="block text-sm font-medium text-gray-700 mb-2">
                Organizer Name *
              </label>
              <input
                type="text"
                id="organizer_name"
                name="organizer_name"
                value={formData.organizer_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter organizer name"
              />
            </div>

            {/* Location URL */}
            <div>
              <label htmlFor="location_url" className="block text-sm font-medium text-gray-700 mb-2">
                Location URL (Optional)
              </label>
              <input
                type="url"
                id="location_url"
                name="location_url"
                value={formData.location_url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://maps.example.com/location"
              />
            </div>

            {/* Guests Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Event Guests</h3>
              
              {/* Add Guest Form */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guest Name *
                    </label>
                    <input
                      type="text"
                      name="guest_name"
                      value={newGuest.guest_name}
                      onChange={handleGuestInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter guest name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Designation *
                    </label>
                    <textarea
                      name="guest_designation"
                      value={newGuest.guest_designation}
                      onChange={handleGuestInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter designation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guest Image (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleGuestImageChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {newGuest.guest_image_preview && (
                      <div className="mt-2 relative">
                        <img
                          src={newGuest.guest_image_preview}
                          alt="Guest preview"
                          className="h-16 w-16 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addGuest}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Add Guest
                </button>
              </div>

              {/* Guest List */}
              {formData.guests.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-700">Added Guests:</h4>
                  {formData.guests.map((guest, index) => (
                    <div key={index} className="flex items-start justify-between bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Guest Image */}
                        {(guest.guest_image_preview || (typeof guest.guest_image === 'string' && guest.guest_image)) && (
                          <div className="flex-shrink-0">
                            <img
                              src={guest.guest_image_preview || guest.guest_image}
                              alt={guest.guest_name}
                              className="h-16 w-16 object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{guest.guest_name}</p>
                          <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{guest.guest_designation}</p>
                          {guest.guest_image instanceof File && (
                            <p className="text-xs text-gray-500 mt-1">Image: {guest.guest_image.name}</p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGuest(index)}
                        className="ml-4 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Social Links Section */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Social Links</h3>
              
              {/* Add Social Link Form */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Platform Key *
                    </label>
                    <input
                      type="text"
                      name="key"
                      value={newSocialLink.key}
                      onChange={handleSocialLinkInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., facebook, instagram, website"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL *
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={newSocialLink.url}
                      onChange={handleSocialLinkInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/profile"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addSocialLink}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Add Social Link
                </button>
              </div>

              {/* Social Links List */}
              {Object.keys(formData.social_links).length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-md font-medium text-gray-700">Added Social Links:</h4>
                  {Object.entries(formData.social_links).map(([key, url]) => (
                    <div key={key} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 capitalize">{key}</p>
                        <p className="text-sm text-gray-600 break-all">{url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSocialLink(key)}
                        className="ml-4 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
                  </div>
                ) : (
                  isEdit ? 'Update Event' : 'Create Event'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Form Tips */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Form Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• All fields marked with * are required</li>
            <li>• Use 24-hour format for times (e.g., 14:30 for 2:30 PM)</li>
            <li>• Use high-quality images for better presentation</li>
            <li>• Provide clear and concise event descriptions</li>
            <li>• Double-check dates and times before submitting</li>
            <li>• For social links, use platform names as keys (e.g., facebook, instagram, website)</li>
            <li>• You can add multiple guests to your event</li>
            <li>• Guest images must be JPEG, PNG, or GIF files under 10MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
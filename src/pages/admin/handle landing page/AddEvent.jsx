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
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');

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
          date: event.date || '',
          location: event.location || '',
          location_url: event.location_url || '',
          start_time: event.start_time ? event.start_time.substring(0, 5) : '',
          end_time: event.end_time ? event.end_time.substring(0, 5) : '',
          image: null
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
    const requiredFields = ['title', 'description', 'date', 'location', 'start_time', 'end_time'];
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
      
      // Format times for API
      submitData.append('start_time', formatTimeForAPI(formData.start_time));
      submitData.append('end_time', formatTimeForAPI(formData.end_time));
      
      if (formData.location_url) {
        submitData.append('location_url', formData.location_url);
      }
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      // Debug: Log what we're sending
      console.log('Submitting data:');
      console.log('Title:', formData.title);
      console.log('Start Time:', formData.start_time, '->', formatTimeForAPI(formData.start_time));
      console.log('End Time:', formData.end_time, '->', formatTimeForAPI(formData.end_time));

      let response;
      if (isEdit) {
        // For Laravel, use POST with _method=PUT for file uploads
        submitData.append('_method', 'PUT');
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    PNG, JPG, JPEG up to 10MB
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
                  step="1" // Some browsers need this for proper time handling
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
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
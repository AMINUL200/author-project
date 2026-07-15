import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const HandleEventGallery = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const navigate = useNavigate();

  // State for events dropdown
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(true);

  // State for gallery items
  const [galleryItems, setGalleryItems] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);

  // State for form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    event_id: '',
    type: 'image',
    file: '',
    title: '',
    image_alt: '',
    title_meta: '',
    is_active: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetch all events (only id and title)
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${apiUrl}events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          t: Date.now(),
        },
      });

      if (response.status === 200) {
        // Store only id and title
        const eventList = response.data.data.map(event => ({
          id: event.id,
          title: event.title
        }));
        setEvents(eventList);
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to fetch events');
    } finally {
      setLoadingEvents(false);
    }
  };

  // Fetch gallery items for selected event
  const fetchGalleryItems = async (eventId) => {
    if (!eventId) {
      setGalleryItems([]);
      return;
    }

    setLoadingGallery(true);
    try {
      const response = await axios.get(`${apiUrl}event-gallery`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          event_id: eventId,
          t: Date.now(),
        },
      });

      if (response.status === 200) {
        setGalleryItems(response.data.data);
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to fetch gallery items');
    } finally {
      setLoadingGallery(false);
    }
  };

  // Handle event selection change
  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);
    if (eventId) {
      fetchGalleryItems(eventId);
    } else {
      setGalleryItems([]);
    }
  };

  // Open modal for adding new gallery item
  const handleAddNew = () => {
    setIsEditing(false);
    setEditId(null);
    setSelectedFile(null);
    setFormData({
      event_id: selectedEvent || '',
      type: 'image',
      file: '',
      title: '',
      image_alt: '',
      title_meta: '',
      is_active: true
    });
    setIsModalOpen(true);
  };

  // Open modal for editing gallery item
  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setSelectedFile(null);
    setFormData({
      event_id: item.event_id,
      type: item.type,
      file: item.file,
      title: item.title || '',
      image_alt: item.image_alt || '',
      title_meta: item.title_meta || '',
      is_active: item.is_active
    });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle file upload for images and videos
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should be less than 10MB');
        e.target.value = '';
        return;
      }

      // Check file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
      
      if (formData.type === 'image' && !validImageTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, GIF, WEBP)');
        e.target.value = '';
        return;
      }
      
      if (formData.type === 'video' && !validVideoTypes.includes(file.type)) {
        toast.error('Please upload a valid video file (MP4, WEBM, OGG)');
        e.target.value = '';
        return;
      }

      setSelectedFile(file);
      
      // Preview the file
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          file: reader.result // This is base64 string for preview
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission with FormData
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.event_id) {
      toast.error('Please select an event');
      return;
    }

    // For URL type, validate URL
    if (formData.type === 'url') {
      if (!formData.file) {
        toast.error('Please provide a URL');
        return;
      }
      try {
        new URL(formData.file);
      } catch (_) {
        toast.error('Please enter a valid URL');
        return;
      }
    }

    // For image and video types, check if file is selected
    if (formData.type !== 'url') {
      if (!selectedFile && !isEditing) {
        toast.error(`Please select a ${formData.type === 'image' ? 'image' : 'video'} file`);
        return;
      }
      if (!selectedFile && isEditing && !formData.file) {
        toast.error(`Please select a ${formData.type === 'image' ? 'image' : 'video'} file`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const url = isEditing 
        ? `${apiUrl}event-gallery/update/${editId}`
        : `${apiUrl}event-gallery/store`;

      // Create FormData object
      const formDataPayload = new FormData();
      
      // Append all fields
      formDataPayload.append('event_id', formData.event_id);
      formDataPayload.append('type', formData.type);
      formDataPayload.append('title', formData.title || '');
      formDataPayload.append('image_alt', formData.image_alt || '');
      formDataPayload.append('title_meta', formData.title_meta || '');
      formDataPayload.append('is_active', formData.is_active ? '1' : '0');

      // Handle file/URL based on type
      if (formData.type === 'url') {
        formDataPayload.append('file', formData.file);
      } else {
        // For image and video, append the actual file
        if (selectedFile) {
          formDataPayload.append('file', selectedFile);
        } else if (isEditing && formData.file) {
          // If editing and no new file selected, keep the existing file
          formDataPayload.append('file', formData.file);
        }
      }

      // Log FormData contents for debugging
      console.log('FormData entries:');
      for (let pair of formDataPayload.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await axios.post(url, formDataPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(isEditing ? 'Gallery item updated successfully' : 'Gallery item added successfully');
        setIsModalOpen(false);
        setSelectedFile(null);
        // Refresh gallery items
        fetchGalleryItems(selectedEvent);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to save gallery item');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) {
      return;
    }

    setDeletingId(itemId);
    try {
      const response = await axios.delete(`${apiUrl}event-gallery/delete/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success('Gallery item deleted successfully');
        setGalleryItems(galleryItems.filter(item => item.id !== itemId));
      }
    } catch (error) {
      console.log(error.message);
      toast.error('Failed to delete gallery item');
    } finally {
      setDeletingId(null);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setFormData({
      event_id: selectedEvent || '',
      type: 'image',
      file: '',
      title: '',
      image_alt: '',
      title_meta: '',
      is_active: true
    });
  };

  // Get file input accept attribute based on type
  const getFileAccept = () => {
    if (formData.type === 'image') {
      return 'image/jpeg,image/png,image/gif,image/webp';
    } else if (formData.type === 'video') {
      return 'video/mp4,video/webm,video/ogg';
    }
    return '';
  };

  // Get file input label based on type
  const getFileLabel = () => {
    if (formData.type === 'image') return 'Image File *';
    if (formData.type === 'video') return 'Video File *';
    return 'URL *';
  };

  // Get file input placeholder based on type
  const getFilePlaceholder = () => {
    if (formData.type === 'url') {
      return 'https://www.youtube.com/watch?v=...';
    }
    return '';
  };

  // Render media preview based on type
  const renderMediaPreview = (item) => {
    if (item.type === 'url') {
      return (
        <div className="w-full h-48 flex items-center justify-center bg-gray-100">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    } else if (item.type === 'video') {
      return (
        <video className="w-full h-48 object-cover" controls>
          <source src={item.file} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <img
          src={item.file}
          alt={item.title || 'Gallery item'}
          className="w-full h-48 object-cover"
        />
      );
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  if (loadingEvents) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Event Gallery Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage images, videos, and URLs for your events
          </p>
        </div>

        {/* Event Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Event
              </label>
              <select
                value={selectedEvent}
                onChange={handleEventChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))}
              </select>
            </div>
            {selectedEvent && (
              <button
                onClick={handleAddNew}
                className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Gallery Item</span>
              </button>
            )}
          </div>
        </div>

        {/* Gallery Items Grid */}
        {selectedEvent ? (
          loadingGallery ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No gallery items</h3>
              <p className="mt-1 text-sm text-gray-500">Add images, videos, or URLs to this event.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  {/* Media Preview */}
                  <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                    {renderMediaPreview(item)}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.type === 'url' ? 'bg-purple-100 text-purple-800' : 
                        item.type === 'video' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {item.type.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {item.title || 'Untitled'}
                    </h3>
                    
                    {item.image_alt && (
                      <p className="text-sm text-gray-500 mb-1">Alt: {item.image_alt}</p>
                    )}
                    
                    <p className="text-xs text-gray-400 mb-3">
                      Event: {item.event?.title || 'N/A'}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit</span>
                      </button>
                      
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === item.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                        <span>{deletingId === item.id ? '...' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">Please select an event to manage its gallery</p>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEditing ? 'Edit Gallery Item' : 'Add New Gallery Item'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Event ID - Hidden or disabled */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event
                  </label>
                  <input
                    type="text"
                    value={events.find(e => e.id === parseInt(formData.event_id))?.title || 'Selected Event'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="url">URL</option>
                  </select>
                </div>

                {/* File/URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getFileLabel()}
                  </label>
                  {formData.type === 'url' ? (
                    <input
                      type="url"
                      name="file"
                      value={formData.file}
                      onChange={handleInputChange}
                      placeholder={getFilePlaceholder()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  ) : (
                    <input
                      type="file"
                      name="file"
                      onChange={handleFileChange}
                      accept={getFileAccept()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required={!isEditing}
                    />
                  )}
                  {isEditing && formData.type !== 'url' && formData.file && !selectedFile && (
                    <p className="mt-1 text-sm text-gray-500">Current file: {formData.file.substring(0, 50)}...</p>
                  )}
                  {selectedFile && (
                    <p className="mt-1 text-sm text-green-600">New file selected: {selectedFile.name}</p>
                  )}
                  {formData.type === 'image' && (
                    <p className="mt-1 text-xs text-gray-500">Supported: JPEG, PNG, GIF, WEBP (Max 10MB)</p>
                  )}
                  {formData.type === 'video' && (
                    <p className="mt-1 text-xs text-gray-500">Supported: MP4, WEBM, OGG (Max 10MB)</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Image Alt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    name="image_alt"
                    value={formData.image_alt}
                    onChange={handleInputChange}
                    placeholder="Enter alt text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Title Meta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title Meta
                  </label>
                  <input
                    type="text"
                    name="title_meta"
                    value={formData.title_meta}
                    onChange={handleInputChange}
                    placeholder="Enter meta title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Active Status */}
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      isEditing ? 'Update' : 'Save'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandleEventGallery;
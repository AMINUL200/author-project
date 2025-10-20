import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddFeatureBook = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("update");

  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author_name: '',
    published_date: '',
    title_seo: '',
    image_alt: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');

  // Fetch book data if in edit mode
  useEffect(() => {
    if (isEdit) {
      fetchBookData();
    }
  }, [isEdit]);

  const fetchBookData = async () => {
    setFormLoading(true);
    try {
      const response = await axios.get(`${apiUrl}feature-publications/show/${isEdit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const book = response.data.data;
        console.log('Fetched book data:', book);
        
        setFormData({
          title: book.title || '',
          author_name: book.author_name || '',
          published_date: book.published_date || '',
          title_seo: book.title_seo || '',
          image_alt: book.image_alt || '',
          image: null
        });
        setImagePreview(book.image || '');
      }
    } catch (error) {
      console.log('Error fetching book:', error);
      toast.error("Failed to fetch book data");
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
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, WebP)');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['title', 'author_name', 'published_date'];
    const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate image for new book
    if (!isEdit && !formData.image) {
      toast.error('Please select a book image');
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append all fields
      submitData.append('title', formData.title);
      submitData.append('author_name', formData.author_name);
      submitData.append('published_date', formData.published_date);
      submitData.append('title_seo', formData.title_seo);
      submitData.append('image_alt', formData.image_alt);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      // Debug: Log what we're sending
      console.log('Submitting book data:');
      console.log('Title:', formData.title);
      console.log('Author:', formData.author_name);
      console.log('Published Date:', formData.published_date);
      console.log('SEO Title:', formData.title_seo);
      console.log('Image Alt:', formData.image_alt);
      console.log('Has Image:', !!formData.image);

      let response;
      if (isEdit) {
        // For Laravel, use POST with _method=PUT for file uploads
        // submitData.append('_method', 'PUT');
        response = await axios.post(`${apiUrl}feature-publications/update/${isEdit}`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Create new book
        response = await axios.post(`${apiUrl}feature-publications/store`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(`Book ${isEdit ? 'updated' : 'created'} successfully`);
        navigate('/admin/landing-page/feature-book');
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
        toast.error(`Failed to ${isEdit ? 'update' : 'create'} book: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/landing-page/feature-book');
  };

  // Show loading while fetching book data for editing
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
            {isEdit ? 'Edit Featured Book' : 'Add New Featured Book'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {isEdit ? 'Update the book details' : 'Add a new book to featured publications'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow-sm rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Cover Image {!isEdit && '*'}
              </label>
              <div className="flex items-start space-x-6">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    PNG, JPG, JPEG, WebP up to 5MB
                  </p>
                  {isEdit && (
                    <p className="mt-1 text-xs text-blue-600">
                      Leave empty to keep current image
                    </p>
                  )}
                </div>
                {(imagePreview || formData.image) && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Book cover preview"
                      className="h-32 w-24 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
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
                Book Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter book title"
              />
            </div>

            {/* Author Name */}
            <div>
              <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-2">
                Author Name *
              </label>
              <input
                type="text"
                id="author_name"
                name="author_name"
                value={formData.author_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter author name"
              />
            </div>

            {/* Published Date */}
            <div>
              <label htmlFor="published_date" className="block text-sm font-medium text-gray-700 mb-2">
                Published Date *
              </label>
              <input
                type="date"
                id="published_date"
                name="published_date"
                value={formData.published_date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* SEO Title */}
            <div>
              <label htmlFor="title_seo" className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                id="title_seo"
                name="title_seo"
                value={formData.title_seo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter SEO title for better search visibility"
              />
              <p className="mt-1 text-xs text-gray-500">
                Optional: A SEO-friendly title for search engines
              </p>
            </div>

            {/* Image Alt Text */}
            <div>
              <label htmlFor="image_alt" className="block text-sm font-medium text-gray-700 mb-2">
                Image Alt Text
              </label>
              <input
                type="text"
                id="image_alt"
                name="image_alt"
                value={formData.image_alt}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter descriptive text for the book cover image"
              />
              <p className="mt-1 text-xs text-gray-500">
                Optional: Descriptive text for accessibility and SEO
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
                  </div>
                ) : (
                  isEdit ? 'Update Book' : 'Create Book'
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
            <li>• Use high-quality book cover images for better presentation</li>
            <li>• Ensure the published date is accurate</li>
            <li>• Double-check author name spelling</li>
            <li>• SEO Title helps with search engine visibility</li>
            <li>• Image Alt Text improves accessibility and SEO</li>
            {isEdit && (
              <li>• Leave image field empty to keep the current book cover</li>
            )}
          </ul>
        </div>

        {/* Current Book Preview (Edit Mode) */}
        {isEdit && imagePreview && !formData.image && (
          <div className="mt-6 bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800 mb-2">Current Book Cover</h3>
            <div className="flex items-center space-x-4">
              <img
                src={imagePreview}
                alt="Current book cover"
                className="h-40 w-28 object-cover rounded-lg shadow-md"
              />
              <div className="text-sm text-green-700">
                <p>This is the current book cover image.</p>
                <p>Upload a new image above if you want to change it.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFeatureBook;
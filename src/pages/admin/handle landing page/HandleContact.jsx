import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../context/AuthContext';

const HandleContact = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const { token } = useAuth();
    
    const [contactData, setContactData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        address: '',
        email: '',
        website: '',
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: ''
    });

    // Fetch contact data
    const fetchContactData = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${apiUrl}contacts/edit`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.status && response.data.data) {
                setContactData(response.data.data);
                setFormData({
                    title: response.data.data.title || '',
                    address: response.data.data.address || '',
                    email: response.data.data.email || '',
                    website: response.data.data.website || '',
                    facebook: response.data.data.facebook || '',
                    instagram: response.data.data.instagram || '',
                    twitter: response.data.data.twitter || '',
                    linkedin: response.data.data.linkedin || ''
                });
            }
        } catch (err) {
            setError('Failed to fetch contact data');
            console.error('Error fetching contact data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Update contact data
    const updateContact = async () => {
        setLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const response = await axios.post(
                `${apiUrl}contacts`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.data.status) {
                setSuccess('Contact information updated successfully!');
                setContactData(response.data.data);
            }
        } catch (err) {
            setError('Failed to update contact information');
            console.error('Error updating contact:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        // Fetch data when component mounts
        fetchContactData();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Manage Contact Information</h1>
            
            {/* Contact Data Button */}
            <div className="mb-6">
                <button
                    onClick={fetchContactData}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                >
                    {loading ? 'Loading...' : 'Get Contact Data'}
                </button>
            </div>

            {/* Error and Success Messages */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            {/* Input Fields */}
            {contactData && (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Title / Office Name
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter office title"
                            />
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Address
                            </label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter full address"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter email address"
                            />
                        </div>

                        {/* Website */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Website
                            </label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com"
                            />
                        </div>

                        {/* Social Media Links */}
                        <div className="md:col-span-2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Media Links</h3>
                        </div>

                        {/* Facebook */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Facebook URL
                            </label>
                            <input
                                type="url"
                                name="facebook"
                                value={formData.facebook}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://facebook.com/username"
                            />
                        </div>

                        {/* Instagram */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Instagram URL
                            </label>
                            <input
                                type="url"
                                name="instagram"
                                value={formData.instagram}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://instagram.com/username"
                            />
                        </div>

                        {/* Twitter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Twitter URL
                            </label>
                            <input
                                type="url"
                                name="twitter"
                                value={formData.twitter}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://twitter.com/username"
                            />
                        </div>

                        {/* LinkedIn */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                LinkedIn URL
                            </label>
                            <input
                                type="url"
                                name="linkedin"
                                value={formData.linkedin}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>
                    </div>

                    {/* Update Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={updateContact}
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Contact Information'}
                        </button>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && !contactData && (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2">Loading contact data...</p>
                </div>
            )}

            {/* No Data State */}
            {!loading && !contactData && !error && (
                <div className="text-center py-8 text-gray-500">
                    Click "Get Contact Data" to load the contact information
                </div>
            )}
        </div>
    );
};

export default HandleContact;
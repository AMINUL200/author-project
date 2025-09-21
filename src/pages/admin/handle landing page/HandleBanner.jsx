import React, { useState } from "react";

const HandleBanner = () => {
  const [bannerData, setBannerData] = useState({
    title: "",
    subtitle: "",
    primaryButtonText: "",
    primaryButtonLink: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
  });

  const handleChange = (e) => {
    setBannerData({ ...bannerData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // TODO: Send this data to backend (via fetch/axios)
    console.log("Updated Banner Data:", bannerData);
  };

  return (
    <div className="p-6 mt-8 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Update Hero Section</h2>
      
      <div className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Hero Title"
          value={bannerData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="subtitle"
          placeholder="Hero Subtitle"
          value={bannerData.subtitle}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="primaryButtonText"
          placeholder="Primary Button Text"
          value={bannerData.primaryButtonText}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="primaryButtonLink"
          placeholder="Primary Button Link"
          value={bannerData.primaryButtonLink}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="secondaryButtonText"
          placeholder="Secondary Button Text"
          value={bannerData.secondaryButtonText}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="secondaryButtonLink"
          placeholder="Secondary Button Link"
          value={bannerData.secondaryButtonLink}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        
        <button
          onClick={handleSubmit}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default HandleBanner;

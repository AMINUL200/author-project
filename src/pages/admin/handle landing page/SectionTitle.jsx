import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

const SectionTitle = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const {  token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [handleLoading, setHandleLoading] = useState(false)
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
  });

  const fetchSectionTitle = async () => {
    try {
        const response = await axios.get(`${apiUrl}sections/edit`,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });

        if(response.data.status){
            setFormData(response.data.data)
            console.log(response.data.data);
        }
        
        
    } catch (error) {
        console.log(error.message);
        toast.error(error.message)
    }finally{
        setLoading(false)
    }
    
  }

  useEffect(()=>{
    fetchSectionTitle();
  },[])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setHandleLoading(true);
    try {
         const response = await axios.post(`${apiUrl}sections/update`,formData, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.status) {
            console.log(response.data);
            toast.success("Update Success ")
            fetchSectionTitle();
        }
        
    } catch (error) {
        console.log(error);
        toast.error(error.message)
    }finally{
        setHandleLoading(false)
    }

    
  };

 

  const formatLabel = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(/Sec(\d+)/g, "Section $1");
  };

  const renderInputField = (key, value) => {
    // Skip these fields
    if (key === "id" || key === "created_at" || key === "updated_at") {
      return null;
    }

    const isParagraph =
      key.includes("para") || key.includes("desc") || key.includes("message");

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
      const section = match ? `Section ${match[1]}` : "Other";
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
            {/* <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Reset
            </button> */}
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

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Clock,
  Tag,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Subscriptions = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [handleLoading, setHandleLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterInterval, setFilterInterval] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    billing_cycle: "",
    billing_interval: "",
    plan_id: "",
    plan_packages: [""],
    button: "Subscribe Now",
  });

  // Fetch subscription list
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUrl}subscription-plans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscriptions(res.data.data || []);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle plan package change
  const handlePackageChange = (index, value) => {
    const updatedPackages = [...formData.plan_packages];
    updatedPackages[index] = value;
    setFormData((prev) => ({ ...prev, plan_packages: updatedPackages }));
  };

  // Add new package field
  const addPackageField = () => {
    setFormData((prev) => ({
      ...prev,
      plan_packages: [...prev.plan_packages, ""],
    }));
  };

  // Remove package field
  const removePackageField = (index) => {
    if (formData.plan_packages.length > 1) {
      const updatedPackages = formData.plan_packages.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({ ...prev, plan_packages: updatedPackages }));
    }
  };

  // Open popup
  const openPopup = (subscription = null) => {
    if (subscription) {
      setEditData(subscription);
      setFormData({
        ...subscription,
        plan_packages: subscription.plan_packages || [""],
      });
    } else {
      setEditData(null);
      setFormData({
        name: "",
        description: "",
        price: 0,
        billing_cycle: "",
        billing_interval: "",
        plan_id: "",
        plan_packages: [""],
        button: "Subscribe Now",
      });
    }
    setPopupOpen(true);
  };

  // Close popup
  const closePopup = () => {
    setPopupOpen(false);
    setEditData(null);
  };

  // Submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setHandleLoading(true);
    try {
      // Filter out empty packages before submitting
      const submitData = {
        ...formData,
        plan_packages: formData.plan_packages.filter(
          (pkg) => pkg.trim() !== ""
        ),
      };

      if (editData) {
        // Update
        await axios.post(
          `${apiUrl}subscription-plans/${editData.id}`,
          submitData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        // Add
        await axios.post(`${apiUrl}subscription-plans`, submitData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchSubscriptions();
      closePopup();
    } catch (err) {
      console.error("Error saving subscription:", err);
    } finally {
      setHandleLoading(false);
    }
  };

  // Delete subscription
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await axios.delete(`${apiUrl}subscription-plans/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSubscriptions();
    } catch (err) {
      console.error("Error deleting subscription:", err);
    }
  };

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      !filterInterval || sub.billing_interval === filterInterval;
    return matchesSearch && matchesFilter;
  });

  const getBillingBadgeColor = (interval) => {
    switch (interval) {
      case "day":
        return "bg-green-100 text-green-800 border-green-200";
      case "week":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "month":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "year":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Subscription Plans
          </h1>
          <p className="text-gray-600">
            Manage your subscription plans and pricing tiers
          </p>
        </div>
        <button
          onClick={() => openPopup()}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
        >
          <Plus size={20} />
          Add New Plan
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search plans by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterInterval}
              onChange={(e) => setFilterInterval(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white min-w-[150px]"
            >
              <option value="">All Intervals</option>
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Subscription Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSubscriptions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {sub.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {sub.description}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openPopup(sub)}
                    className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                    title="Edit plan"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete plan"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{sub.price.toLocaleString()}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getBillingBadgeColor(
                      sub.billing_interval
                    )}`}
                  >
                    {sub.billing_cycle} {sub.billing_interval}
                    {sub.billing_cycle > 1 ? "s" : ""}
                  </span>
                </div>

                {/* Plan Packages */}
                {sub.plan_packages && sub.plan_packages.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Package Includes:
                    </h4>
                    <ul className="space-y-2">
                      {sub.plan_packages.map((pkg, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{pkg}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Tag size={14} />
                    <span>Plan ID: {sub.plan_id}</span>
                  </div>
                  {sub.button && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Button Text: "{sub.button}"</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredSubscriptions.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No subscription plans found
              </h3>
              <p className="text-gray-500 mb-6">
                Get started by creating your first subscription plan
              </p>
              <button
                onClick={() => openPopup()}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                Add Your First Plan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {popupOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  {editData ? "Edit Plan" : "Create New Plan"}
                </h3>
                <button
                  onClick={closePopup}
                  className="p-2 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Basic Plan"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what this plan offers..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (₹)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="999"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Billing Cycle
                  </label>
                  <input
                    type="number"
                    name="billing_cycle"
                    value={formData.billing_cycle}
                    onChange={handleChange}
                    placeholder="1"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Interval
                  </label>
                  <select
                    name="billing_interval"
                    value={formData.billing_interval}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                    required
                  >
                    <option value="">Select</option>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Plan ID
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="plan_id"
                    value={formData.plan_id}
                    onChange={handleChange}
                    placeholder="basic_001"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Plan Packages */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Plan Packages
                  </label>
                  <button
                    type="button"
                    onClick={addPackageField}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    + Add Package
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.plan_packages.map((pkg, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={pkg}
                        onChange={(e) =>
                          handlePackageChange(index, e.target.value)
                        }
                        placeholder={`Package feature ${index + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                      {formData.plan_packages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePackageField(index)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  name="button"
                  value={formData.button}
                  onChange={handleChange}
                  placeholder="e.g., Subscribe Free, Buy Now, etc."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closePopup}
                  disabled={handleLoading}
                  className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={handleLoading}
                  className={`flex-1 flex items-center justify-center gap-2 
    bg-gradient-to-r from-blue-600 to-blue-700 text-white 
    px-6 py-3 rounded-xl font-medium
    transition-all transform hover:-translate-y-0.5 hover:shadow-lg
    disabled:opacity-70 disabled:cursor-not-allowed`}
                >
                  {handleLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{editData ? "Update Plan" : "Create Plan"}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;

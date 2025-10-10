import { Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";

const PricingSection = ({ sectionTitle = {}, plans, loading, error }) => {
  const { userData, token } = useAuth();
  const navigate = useNavigate();
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  console.log("planDestils:: ", plans);

  // Check authentication status
  const isAuthenticated = () => {
    return !!(token && userData && userData.id);
  };

  // Handle subscription logic here
  const handleSubscribe = async (plan) => {
    // Validate authentication before proceeding
    if (!isAuthenticated()) {
      toast.error("Please login to subscribe to premium plans");
      navigate("/login", {
        state: {
          from: window.location.pathname,
          message: "Please login to subscribe to our premium plans",
        },
      });
      return;
    }

    // Additional validation to ensure userData exists
    if (!userData || !userData.id) {
      toast.error("User information not available. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setLoadingPlanId(plan.id);
      const payload = {
        amount: plan.price,
        currency: "USD",
        user_id: userData.id,
        item_name: plan.name,
        subscription_plan_id: plan.id,
      };

      console.log("Subscription payload:", payload);

      const response = await axios.post(
        `${apiUrl}paypal/create-order`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.data.success) {
        // Redirect to PayPal checkout
        window.location.href = response.data.approval_url;
      } else {
        toast.error("Failed to create PayPal order");
      }
    } catch (error) {
      console.error("PayPal order error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error("Something went wrong with PayPal checkout");
      }
    } finally {
      setLoadingPlanId(null);
    }
  };

  // Handle subscription button click with validation
  const handleSubscriptionClick = (plan) => {
    handleSubscribe(plan);
  };

  if (loading) {
    return (
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {sectionTitle?.sec6_name}
            </h2>
            <p className="text-xl text-gray-600">{sectionTitle?.sec6_para}</p>
          </div>
          {/* Skeleton loader */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl h-64" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50 text-center">
        <p className="text-red-500 text-lg">{error}</p>
      </section>
    );
  }

  return (
    <section className="py-20 pt-10 bg-gray-50" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold  bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {sectionTitle?.sec6_name}
          </h1>
          <p className="text-xl text-gray-600">{sectionTitle?.sec6_para}</p>

          {/* Show login prompt if not authenticated */}
          {!isAuthenticated() && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
              <p className="text-yellow-700 text-sm">
                🔐 {sectionTitle?.sec6_message}
              </p>
            </div>
          )}
        </div>

        {plans?.length === 0 ? (
          <p className="text-center text-gray-500">No plans available</p>
        ) : (
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-20">
            {plans.map((plan, index) => {
              // const isPopular = index === 1; // highlight 2nd plan as "Most Popular"
              const isPopular = false; // highlight 2nd plan as "Most Popular"

              return (
                <div
                  key={plan.id}
                  className={`w-[400px] rounded-xl shadow-lg p-8 relative ${
                    isPopular
                      ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white transform scale-105"
                      : "bg-white text-gray-900"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                  <p
                    className={`mb-6 ${
                      isPopular ? "text-purple-100" : "text-gray-600"
                    }`}
                  >
                    {plan.description}
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      ${parseFloat(plan.price).toFixed(2)}
                    </span>
                    <span
                      className={
                        isPopular ? "text-purple-200" : "text-gray-600"
                      }
                    >
                      /{plan.billing_cycle} {plan.billing_interval}
                      {plan.billing_cycle > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Placeholder features (if API provides features, map here) */}
                  <ul className="space-y-4 mb-8">
                    {plan?.plan_packages.map((pkg, index) => (
                      <li key={index} className="flex items-center">
                        <Check
                          className={
                            isPopular
                              ? "text-white mr-3"
                              : "text-green-500 mr-3"
                          }
                          size={20}
                        />
                        <span>{pkg}</span>
                      </li>
                    ))}

                    
                  </ul>

                  <button
                    onClick={() => handleSubscriptionClick(plan)}
                    disabled={loadingPlanId === plan.id}
                    className={`w-full py-3 rounded-full font-semibold transition-colors ${
                      isPopular
                        ? "bg-white text-purple-600 hover:bg-gray-100"
                        : "border-2 border-gray-300 text-gray-700 hover:border-purple-300 hover:text-purple-600"
                    } ${
                      loadingPlanId === plan.id
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    } ${
                      !isAuthenticated() ? "opacity-90 hover:opacity-100" : ""
                    }`}
                  >
                    {loadingPlanId === plan.id ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : !isAuthenticated() ? (
                      "Login to Subscribe"
                    ) : `${plan?.button}` }
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingSection;

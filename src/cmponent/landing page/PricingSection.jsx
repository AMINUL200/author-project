import { Check } from "lucide-react";

const PricingSection = ({ plans, loading, error }) => {
  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-xl text-gray-600">Start free, upgrade when you're ready</p>
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
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600">Start free, upgrade when you're ready</p>
        </div>

        {plans?.length === 0 ? (
          <p className="text-center text-gray-500">No plans available</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const isPopular = index === 1; // highlight 2nd plan as "Most Popular"

              return (
                <div
                  key={plan.id}
                  className={`rounded-xl shadow-lg p-8 relative ${
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
                    <span className={isPopular ? "text-purple-200" : "text-gray-600"}>
                      /{plan.billing_cycle} {plan.billing_interval}
                      {plan.billing_cycle > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Placeholder features (if API provides features, map here) */}
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center">
                      <Check
                        className={isPopular ? "text-white mr-3" : "text-green-500 mr-3"}
                        size={20}
                      />
                      <span>
                        Includes everything from {plan.name} package
                      </span>
                    </li>
                    <li className="flex items-center">
                      <Check
                        className={isPopular ? "text-white mr-3" : "text-green-500 mr-3"}
                        size={20}
                      />
                      <span>Priority support</span>
                    </li>
                  </ul>

                  <button
                    className={`w-full py-3 rounded-full font-semibold transition-colors ${
                      isPopular
                        ? "bg-white text-purple-600 hover:bg-gray-100"
                        : "border-2 border-gray-300 text-gray-700 hover:border-purple-300 hover:text-purple-600"
                    }`}
                  >
                    {plan.price === "0.00" ? "Get Started" : "Choose Plan"}
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

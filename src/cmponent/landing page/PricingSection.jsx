import { Check } from "lucide-react";

const PricingSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600">Start free, upgrade when you're ready</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-xl shadow-lg p-8 relative">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="text-green-500 mr-3" size={20} />
                <span>Access to 2 pages per article</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 mr-3" size={20} />
                <span>Weekly newsletter</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 mr-3" size={20} />
                <span>Basic community access</span>
              </li>
            </ul>
            <button className="w-full border-2 border-gray-300 text-gray-700 hover:border-purple-300 hover:text-purple-600 py-3 rounded-full font-semibold transition-colors">
              Get Started
            </button>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-xl shadow-xl p-8 relative transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-4">Premium</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">$19</span>
              <span className="text-purple-200">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="text-white mr-3" size={20} />
                <span>Unlimited article access</span>
              </li>
              <li className="flex items-center">
                <Check className="text-white mr-3" size={20} />
                <span>PDF downloads</span>
              </li>
              <li className="flex items-center">
                <Check className="text-white mr-3" size={20} />
                <span>Ad-free experience</span>
              </li>
              <li className="flex items-center">
                <Check className="text-white mr-3" size={20} />
                <span>Premium community</span>
              </li>
              <li className="flex items-center">
                <Check className="text-white mr-3" size={20} />
                <span>Early access to new content</span>
              </li>
            </ul>
            <button className="w-full bg-white text-purple-600 hover:bg-gray-100 py-3 rounded-full font-semibold transition-colors">
              Start Free Trial
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-xl shadow-lg p-8 relative">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$49</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <Check className="text-green-500 mr-3" size={20} />
                <span>Everything in Premium</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 mr-3" size={20} />
                <span>1-on-1 author sessions</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 mr-3" size={20} />
                <span>Custom research requests</span>
              </li>
              <li className="flex items-center">
                <Check className="text-green-500 mr-3" size={20} />
                <span>Priority support</span>
              </li>
            </ul>
            <button className="w-full border-2 border-gray-300 text-gray-700 hover:border-purple-300 hover:text-purple-600 py-3 rounded-full font-semibold transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default PricingSection;
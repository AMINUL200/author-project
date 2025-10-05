import React, { useState } from "react";
import { Calendar, Clock, Star, CreditCard, CheckCircle, AlertCircle, Users, Zap } from "lucide-react";

const SubscriptionDetails = () => {
  const [activeTab, setActiveTab] = useState('current');

  // Mock data - replace with your actual data
  const currentSubscription = {
    plan: "Pro Plan",
    status: "Active",
    price: "$29.99",
    billing: "monthly",
    nextBilling: "2025-10-25",
    daysLeft: 30,
    features: ["Unlimited projects", "Advanced analytics", "Priority support", "Custom integrations"]
  };

  const subscriptionHistory = [
    {
      id: 1,
      plan: "Pro Plan",
      period: "Sep 2025 - Oct 2025",
      amount: "$29.99",
      status: "Active",
      date: "2025-09-25"
    },
    {
      id: 2,
      plan: "Pro Plan",
      period: "Aug 2025 - Sep 2025",
      amount: "$29.99",
      status: "Completed",
      date: "2025-08-25"
    },
    {
      id: 3,
      plan: "Basic Plan",
      period: "Jul 2025 - Aug 2025",
      amount: "$9.99",
      status: "Completed",
      date: "2025-07-25"
    },
    {
      id: 4,
      plan: "Basic Plan",
      period: "Jun 2025 - Jul 2025",
      amount: "$9.99",
      status: "Completed",
      date: "2025-06-25"
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Details</h1>
          <p className="text-gray-600">Manage your subscription and view billing history</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('current')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'current'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Current Plan
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Billing History
            </button>
          </nav>
        </div>

        {/* Current Subscription Tab */}
        {activeTab === 'current' && (
          <div className="space-y-8">
            {/* Current Plan Card */}
            <div className="border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">{currentSubscription.plan}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      currentSubscription.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {currentSubscription.status === 'Active' ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mr-1" />
                      )}
                      {currentSubscription.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{currentSubscription.price}</div>
                  <div className="text-gray-500">per {currentSubscription.billing}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Billing Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Billing Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Next billing date</span>
                      <span className="font-medium text-gray-900">{formatDate(currentSubscription.nextBilling)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-700">Days remaining</span>
                      <span className="font-bold text-blue-900">{currentSubscription.daysLeft} days</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="h-5 w-5 text-blue-600" />
                    Plan Features
                  </h3>
                  <div className="space-y-2">
                    {currentSubscription.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-2">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Update Payment
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Change Plan
                </button>
                <button className="text-red-600 px-6 py-2 rounded-lg hover:bg-red-50 transition-colors duration-200">
                  Cancel Subscription
                </button>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-300">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">5/10</div>
                <div className="text-gray-600">Team Members</div>
              </div>
              <div className="border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-300">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">847/1000</div>
                <div className="text-gray-600">API Calls</div>
              </div>
              <div className="border border-gray-200 rounded-xl p-6 text-center hover:shadow-md transition-shadow duration-300">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">23</div>
                <div className="text-gray-600">Active Projects</div>
              </div>
            </div>
          </div>
        )}

        {/* Billing History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Billing History</h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium">Download All</button>
            </div>

            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Plan</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Period</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptionHistory.map((item, index) => (
                      <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${index === 0 ? 'bg-blue-50' : ''}`}>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{item.plan}</div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{item.period}</td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-gray-900">{item.amount}</span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            item.status === 'Active' 
                              ? 'bg-blue-100 text-blue-800' 
                              : item.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{formatDate(item.date)}</td>
                        <td className="py-4 px-6">
                          <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Download Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-1">Total Spent</div>
                <div className="text-2xl font-bold text-gray-900">$79.96</div>
                <div className="text-sm text-green-600 mt-1">↗ 4 payments</div>
              </div>
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-1">Average Monthly</div>
                <div className="text-2xl font-bold text-gray-900">$19.99</div>
                <div className="text-sm text-gray-600 mt-1">Last 4 months</div>
              </div>
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="text-sm text-gray-600 mb-1">Member Since</div>
                <div className="text-2xl font-bold text-gray-900">Jun 2025</div>
                <div className="text-sm text-blue-600 mt-1">4 months ago</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDetails;
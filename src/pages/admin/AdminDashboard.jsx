import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";
import {
  FileText, Users, UserCheck, DollarSign, Clock
} from "lucide-react";

const AdminDashboard = () => {
  // Dummy Data – replace with API calls
  const stats = [
    { title: "Total Articles", value: 120, icon: <FileText className="w-6 h-6 text-blue-600" /> },
    { title: "Active Authors", value: 15, icon: <Users className="w-6 h-6 text-green-600" /> },
    { title: "Subscribers", value: 300, icon: <UserCheck className="w-6 h-6 text-purple-600" /> },
    { title: "Revenue", value: "₹45,000", icon: <DollarSign className="w-6 h-6 text-yellow-600" /> },
  ];

  const articleData = [
    { month: "Jan", articles: 10 },
    { month: "Feb", articles: 15 },
    { month: "Mar", articles: 20 },
    { month: "Apr", articles: 18 },
    { month: "May", articles: 22 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 5000 },
    { month: "Feb", revenue: 7000 },
    { month: "Mar", revenue: 10000 },
    { month: "Apr", revenue: 8500 },
    { month: "May", revenue: 12000 },
  ];

  const recentArticles = [
    { title: "AI in Publishing", date: "2025-09-15" },
    { title: "How to Write Better PDFs", date: "2025-09-14" },
    { title: "React 19 Released", date: "2025-09-12" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center p-4 gap-4 bg-white rounded-2xl shadow-md hover:shadow-lg transition"
          >
            <div className="p-3 bg-gray-100 rounded-xl">{item.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <h2 className="text-xl font-semibold">{item.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Articles Chart */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Articles Published per Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={articleData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="articles" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-md p-4">
          <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" /> Recent Activity
        </h3>
        <ul className="space-y-3">
          {recentArticles.map((article, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center border-b pb-2 last:border-none"
            >
              <span className="text-gray-700">{article.title}</span>
              <span className="text-sm text-gray-500">{article.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;

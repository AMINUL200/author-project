import React from 'react'
import { useNavigate } from 'react-router-dom';

const BlogPage = () => {
    const navigate = useNavigate();
  // Sample blog data (adapted from the original project data)
  const blogs = [
    {
      id: 1,
      title: 'Designing Fintech Dashboards',
      subtitle: 'Modern financial analytics interface with real-time data visualization',
      date: 'June 2023',
      category: 'Design',
      categoryIcon: 'fa-paint-brush',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    },
    {
      id: 2,
      title: 'Building an E-Learning Platform',
      subtitle: 'Full-stack educational platform with video courses and assessments',
      date: 'May 2023',
      category: 'Development',
      categoryIcon: 'fa-code',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
    },
    {
      id: 3,
      title: 'Brand Identity for Organic Food',
      subtitle: 'Complete brand identity system for sustainable food company',
      date: 'April 2023',
      category: 'Branding',
      categoryIcon: 'fa-bullhorn',
      image: 'https://images.unsplash.com/photo-1567446537710-0e9b8d4d8c4d?w=800&q=80',
    },
    {
      id: 4,
      title: 'Creating a Fitness Tracker App',
      subtitle: 'Cross-platform fitness application with AI workout plans',
      date: 'March 2023',
      category: 'Mobile',
      categoryIcon: 'fa-mobile-alt',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    },
    {
      id: 5,
      title: 'UX Strategy for Travel Booking',
      subtitle: 'User-centered design for seamless travel experience',
      date: 'February 2023',
      category: 'Design',
      categoryIcon: 'fa-paint-brush',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    },
    {
      id: 6,
      title: 'Viral Marketing Campaign Insights',
      subtitle: 'Viral marketing strategy for tech startup launch',
      date: 'January 2023',
      category: 'Marketing',
      categoryIcon: 'fa-chart-line',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] font-sans text-[#333]">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {/* Page Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1a1a1a] mb-4 tracking-tight">
            Our Blog
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
            Thoughts, stories, and ideas about design, development, and digital innovation.
          </p>
        </header>

        {/* Blogs Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer h-80 sm:h-96"
            >
              {/* Card Image with Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${blog.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a143c]/95 via-[#0a143c]/70 to-transparent group-hover:from-[#465aff]/95 group-hover:via-[#465aff]/60 group-hover:to-transparent transition-all duration-500"></div>
              </div>

              {/* Badge */}
              <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-[#1a1a1a] shadow-lg flex items-center gap-1.5">
                <i className={`fas ${blog.categoryIcon} text-[#667eea]`}></i>
                {blog.category}
              </div>

              {/* Hover Arrow Box */}
              <div 
              onClick={()=> navigate(`/blogs/${blog.id}`)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/95 backdrop-blur-md rounded-xl flex items-center justify-center opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-400 shadow-2xl z-10">
                <svg
                  className="w-8 h-8 text-[#1a1a1a] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h3 className="text-xl sm:text-2xl font-semibold text-white mb-1 drop-shadow-lg">
                  {blog.title}
                </h3>
                <p className="text-sm text-white/90 mb-3 drop-shadow">{blog.subtitle}</p>
                <div className="text-xs text-white/80 flex items-center gap-2">
                  <i className="far fa-calendar"></i>
                  <span>Published: {blog.date}</span>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Pagination */}
        <div className="flex justify-center">
          <div className="inline-flex gap-1.5 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg">
            <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 text-[#555] hover:bg-gray-200 hover:-translate-y-0.5 transition-all flex items-center justify-center">
              <i className="fas fa-chevron-left"></i>
            </button>
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-semibold transition-all ${
                  num === 1
                    ? 'bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg shadow-[#667eea]/30'
                    : 'bg-gray-100 text-[#555] hover:bg-gray-200 hover:-translate-y-0.5'
                }`}
              >
                {num}
              </button>
            ))}
            <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 text-[#555] hover:bg-gray-200 hover:-translate-y-0.5 transition-all flex items-center justify-center">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
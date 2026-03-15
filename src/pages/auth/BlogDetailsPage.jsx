import React from 'react'

const BlogDetailsPage = () => {
  // Sample related blogs data
  const relatedBlogs = [
    {
      id: 1,
      title: 'Designing Fintech Dashboards',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
      date: 'June 2023',
    },
    {
      id: 2,
      title: 'Building an E-Learning Platform',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
      date: 'May 2023',
    },
    {
      id: 3,
      title: 'Brand Identity for Organic Food',
      image: 'https://images.unsplash.com/photo-1567446537710-0e9b8d4d8c4d?w=800&q=80',
      date: 'April 2023',
    },
    {
      id: 4,
      title: 'Creating a Fitness Tracker App',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
      date: 'March 2023',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] font-sans text-[#333]">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm sm:text-base text-gray-600 mb-8">
          <a href="#" className="hover:text-[#667eea] transition-colors">Home</a>
          <i className="fas fa-chevron-right text-xs text-gray-400"></i>
          <a href="#" className="hover:text-[#667eea] transition-colors">Blog</a>
          <i className="fas fa-chevron-right text-xs text-gray-400"></i>
          <span className="text-[#667eea] font-medium">Designing Fintech Dashboards</span>
        </nav>

        {/* 7 Grid Layout (Left 5 / Right 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 lg:gap-12">
          {/* Left Column - Main Article (5 columns) */}
          <div className="lg:col-span-5">
            <article className="bg-white rounded-2xl overflow-hidden shadow-xl">
              {/* Featured Image */}
              <div className="relative h-64 sm:h-80 md:h-96">
                <img
                  src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80"
                  alt="Blog featured"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-[#1a1a1a] shadow-lg flex items-center gap-1.5">
                  <i className="fas fa-paint-brush text-[#667eea]"></i>
                  Design
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6 sm:p-8">
                {/* Title */}
                <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">
                  Designing Fintech Dashboards
                </h1>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-gray-500 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <i className="far fa-calendar"></i>
                    <span>Published: June 2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="far fa-clock"></i>
                    <span>8 min read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="far fa-user"></i>
                    <span>By Sarah Chen</span>
                  </div>
                </div>

                {/* Description / Article Body */}
                <div className="prose prose-lg max-w-none text-gray-700">
                  <p className="lead text-xl text-gray-600 mb-6">
                    Modern financial analytics interface with real-time data visualization requires a delicate balance between complexity and usability. Here's how we approached it.
                  </p>
                  
                  <h2 className="text-2xl font-semibold text-[#1a1a1a] mt-8 mb-4">Understanding User Needs</h2>
                  <p>
                    When designing for fintech, the primary challenge is presenting complex financial data in an intuitive way. Users need to make quick decisions based on accurate information, so every element must serve a purpose.
                  </p>
                  
                  <p>
                    We started with extensive user research, interviewing portfolio managers and financial analysts to understand their daily workflows. This helped us identify key metrics that needed to be front and center.
                  </p>

                  <h2 className="text-2xl font-semibold text-[#1a1a1a] mt-8 mb-4">Visual Design Approach</h2>
                  <p>
                    The color palette was carefully chosen to convey trust and stability – deep blues and greens with strategic pops of color for alerts and notifications. Typography uses a clean, modern sans-serif for optimal readability across devices.
                  </p>

                  <blockquote className="border-l-4 border-[#667eea] bg-gray-50 p-4 my-6 italic">
                    "The dashboard has transformed how our team monitors market movements. We can now spot trends and react in real-time."
                    <footer className="text-sm text-gray-600 mt-2">— Michael Zhang, Investment Analyst</footer>
                  </blockquote>

                  <h2 className="text-2xl font-semibold text-[#1a1a1a] mt-8 mb-4">Key Features</h2>
                  <ul className="list-disc pl-6 mb-6">
                    <li>Real-time data streaming with WebSocket connections</li>
                    <li>Customizable widgets for different user roles</li>
                    <li>Interactive charts with drill-down capabilities</li>
                    <li>Dark mode for extended trading sessions</li>
                  </ul>

                  <p>
                    The result is a dashboard that financial professionals actually enjoy using – it's become an essential tool in their daily workflow.
                  </p>
                </div>
              </div>
            </article>
          </div>

          {/* Right Column - Sidebar (2 columns) */}
          <aside className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-xl sticky top-24">
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
                <i className="fas fa-bolt text-[#667eea]"></i>
                Related Posts
              </h2>
              
              <div className="space-y-6">
                {relatedBlogs.map((blog) => (
                  <a
                    key={blog.id}
                    href="#"
                    className="group block hover:bg-gray-50 rounded-xl p-2 -m-2 transition-colors"
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-[#1a1a1a] group-hover:text-[#667eea] transition-colors line-clamp-2">
                          {blog.title}
                        </h3>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <i className="far fa-calendar"></i>
                          <span>{blog.date}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>

            
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default BlogDetailsPage
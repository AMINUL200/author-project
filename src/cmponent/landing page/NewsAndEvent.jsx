import React, { useState } from 'react'
import { Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react'

const NewsAndEvent = () => {
  const [activeTab, setActiveTab] = useState('all')

  const articles = [
    {
      id: 1,
      type: 'news',
      title: 'Understanding Modern Web Architecture',
      author: 'Sarah Mitchell',
      date: '2025-10-01',
      readTime: '8 min',
      category: 'Technology',
      excerpt: 'Explore the latest trends in web development and how modern architecture is shaping the future of digital experiences.',
      link: '#'
    },
    {
      id: 2,
      type: 'event',
      title: 'Virtual Writing Workshop: Crafting Compelling Stories',
      author: 'James Carter',
      date: '2025-10-15',
      readTime: '2 hours',
      category: 'Workshop',
      excerpt: 'Join us for an interactive session on storytelling techniques that captivate readers from the first line to the last.',
      link: '#'
    },
    {
      id: 3,
      type: 'news',
      title: 'The Art of Technical Writing',
      author: 'Emily Zhang',
      date: '2025-09-28',
      readTime: '6 min',
      category: 'Writing',
      excerpt: 'Discover how to transform complex technical concepts into clear, accessible content that resonates with diverse audiences.',
      link: '#'
    },
    {
      id: 4,
      type: 'event',
      title: 'Author Meetup: Share Your Journey',
      author: 'Michael Brooks',
      date: '2025-10-20',
      readTime: '3 hours',
      category: 'Community',
      excerpt: 'Connect with fellow writers and authors to share experiences, challenges, and success stories in the publishing world.',
      link: '#'
    },
    {
      id: 5,
      type: 'news',
      title: 'Digital Publishing Trends in 2025',
      author: 'Rachel Green',
      date: '2025-09-25',
      readTime: '10 min',
      category: 'Publishing',
      excerpt: 'An in-depth analysis of emerging trends in digital publishing and what they mean for independent authors.',
      link: '#'
    },
    {
      id: 6,
      type: 'event',
      title: 'Q&A Session: Building Your Author Brand',
      author: 'David Liu',
      date: '2025-10-25',
      readTime: '90 min',
      category: 'Marketing',
      excerpt: 'Learn strategies for establishing and growing your presence as an author in the digital age.',
      link: '#'
    }
  ]

  const filteredArticles = activeTab === 'all' 
    ? articles 
    : articles.filter(article => article.type === activeTab)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            News & Events
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover the latest articles from our community of authors and join upcoming events
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {['all', 'news', 'event'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-slate-100"
            >
              {/* Type Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  article.type === 'news' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {article.type.toUpperCase()}
                </span>
                <div className="flex items-center gap-1 text-slate-500">
                  <Tag size={14} />
                  <span className="text-xs">{article.category}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                {article.excerpt}
              </p>

              {/* Meta Info */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <User size={16} />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Calendar size={16} />
                    <span>{new Date(article.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock size={16} />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Read More Link */}
              <a
                href={article.link}
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
              >
                {article.type === 'news' ? 'Read Article' : 'View Event'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">No {activeTab}s found at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsAndEvent
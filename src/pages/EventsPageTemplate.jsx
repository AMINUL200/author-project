import React, { useState } from 'react'
import { Calendar, MapPin, Clock, Users, Share2, Bookmark, Tag, Globe, Mail, Phone, Facebook, Twitter, Linkedin, ChevronRight, Star, Check } from 'lucide-react'

const EventsPageTemplate = () => {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)

  const eventDetails = {
    title: "Tech Innovation Summit 2025",
    subtitle: "Shaping the Future of Technology",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop",
    date: "March 15, 2025",
    endDate: "March 17, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "Moscone Center, San Francisco, CA",
    attendees: 1200,
    category: "Technology",
    rating: 4.8,
    reviews: 324,
    organizer: {
      name: "TechEvents Global",
      logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
      verified: true
    }
  }

  const tickets = [
    {
      id: 1,
      name: "Early Bird",
      price: 199,
      originalPrice: 299,
      description: "Limited time offer",
      features: ["Full conference access", "Welcome kit", "Lunch included", "Networking sessions"],
      available: 50,
      popular: false
    },
    {
      id: 2,
      name: "Standard Pass",
      price: 299,
      description: "Most popular choice",
      features: ["Full conference access", "Welcome kit", "Lunch & refreshments", "Networking sessions", "Certificate of attendance"],
      available: 200,
      popular: true
    },
    {
      id: 3,
      name: "VIP Pass",
      price: 499,
      description: "Premium experience",
      features: ["All Standard features", "VIP lounge access", "Meet & greet with speakers", "Premium seating", "Exclusive dinner", "1-year community access"],
      available: 30,
      popular: false
    }
  ]

  const speakers = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechCorp",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      topic: "Future of AI"
    },
    {
      name: "Michael Chen",
      role: "CTO, InnovateLabs",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      topic: "Cloud Architecture"
    },
    {
      name: "Emily Rodriguez",
      role: "VP Engineering, DataFlow",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      topic: "Machine Learning"
    },
    {
      name: "David Kim",
      role: "Founder, StartupX",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
      topic: "Startup Success"
    }
  ]

  const schedule = [
    {
      time: "9:00 AM - 9:30 AM",
      title: "Registration & Welcome Coffee",
      type: "registration"
    },
    {
      time: "9:30 AM - 10:30 AM",
      title: "Opening Keynote: The Future of Technology",
      speaker: "Sarah Johnson",
      type: "keynote"
    },
    {
      time: "10:45 AM - 12:00 PM",
      title: "Panel Discussion: AI & Ethics",
      speaker: "Multiple Speakers",
      type: "panel"
    },
    {
      time: "12:00 PM - 1:00 PM",
      title: "Networking Lunch",
      type: "break"
    },
    {
      time: "1:00 PM - 2:30 PM",
      title: "Workshop: Building Scalable Systems",
      speaker: "Michael Chen",
      type: "workshop"
    },
    {
      time: "2:45 PM - 4:00 PM",
      title: "Tech Talks: Innovation Showcase",
      speaker: "Various Speakers",
      type: "talk"
    },
    {
      time: "4:15 PM - 5:30 PM",
      title: "Closing Keynote & Q&A",
      speaker: "Emily Rodriguez",
      type: "keynote"
    },
    {
      time: "5:30 PM - 6:30 PM",
      title: "Networking Reception",
      type: "networking"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={eventDetails.image} 
          alt={eventDetails.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Floating Category Badge */}
        <div className="absolute top-6 left-6">
          <span className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-semibold border border-white/30">
            {eventDetails.category}
          </span>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-semibold">{eventDetails.rating}</span>
                <span className="text-white/80 text-sm">({eventDetails.reviews} reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {eventDetails.title}
            </h1>
            <p className="text-xl text-white/90 mb-6">{eventDetails.subtitle}</p>
            
            {/* Quick Info */}
            <div className="flex flex-wrap gap-6 text-white">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{eventDetails.date} - {eventDetails.endDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{eventDetails.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{eventDetails.attendees}+ Attendees</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Event</h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  Join us for the most anticipated technology conference of 2025! The Tech Innovation Summit brings together industry leaders, innovators, and tech enthusiasts from around the globe for three days of inspiring talks, hands-on workshops, and unparalleled networking opportunities.
                </p>
                <p className="mt-4">
                  This year's theme focuses on the transformative power of emerging technologies including AI, machine learning, blockchain, and quantum computing. Discover how these innovations are reshaping industries and creating new opportunities for growth and innovation.
                </p>
                <p className="mt-4">
                  Whether you're a startup founder, enterprise leader, developer, or tech enthusiast, this summit offers valuable insights, practical knowledge, and connections that will propel your career and business forward.
                </p>
              </div>
            </div>

            {/* Speakers Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Speakers</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {speakers.map((speaker, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                    <img 
                      src={speaker.image} 
                      alt={speaker.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100 group-hover:ring-blue-100 transition-all"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {speaker.name}
                      </h3>
                      <p className="text-sm text-gray-600">{speaker.role}</p>
                      <p className="text-xs text-blue-600 font-medium mt-1">{speaker.topic}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Schedule</h2>
              <div className="space-y-4">
                {schedule.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex-shrink-0 w-32">
                      <p className="text-sm font-semibold text-blue-600">{item.time}</p>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      {item.speaker && (
                        <p className="text-sm text-gray-600">{item.speaker}</p>
                      )}
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                        item.type === 'keynote' ? 'bg-purple-100 text-purple-700' :
                        item.type === 'workshop' ? 'bg-blue-100 text-blue-700' :
                        item.type === 'panel' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Venue Location</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">Moscone Center</p>
                    <p className="text-gray-600">747 Howard St, San Francisco, CA 94103</p>
                  </div>
                </div>
                <div className="w-full h-64 bg-gray-200 rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0977426723447!2d-122.40169!3d37.784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ3JzAyLjQiTiAxMjLCsDI0JzA2LjEiVw!5e0!3m2!1sen!2sus!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-18 space-y-6">
              {/* Organizer Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Organized By</h3>
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={eventDetails.organizer.logo} 
                    alt={eventDetails.organizer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{eventDetails.organizer.name}</p>
                      {eventDetails.organizer.verified && (
                        <Check className="w-4 h-4 text-blue-600 fill-blue-100" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Verified Organizer</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    Follow
                  </button>
                  <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    Contact
                  </button>
                </div>
              </div>

              {/* Ticket Selection */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Select Your Ticket</h3>
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div 
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket.id)}
                      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedTicket === ticket.id 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {ticket.popular && (
                        <span className="absolute -top-2 right-4 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full">
                          Popular
                        </span>
                      )}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900">{ticket.name}</h4>
                          <p className="text-xs text-gray-600">{ticket.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${ticket.price}</p>
                          {ticket.originalPrice && (
                            <p className="text-sm text-gray-400 line-through">${ticket.originalPrice}</p>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1 mb-2">
                        {ticket.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                            <Check className="w-3 h-3 text-green-600" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {ticket.features.length > 3 && (
                          <p className="text-xs text-blue-600 font-medium">
                            +{ticket.features.length - 3} more features
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {ticket.available} tickets remaining
                      </p>
                    </div>
                  ))}
                </div>

                <button 
                  className={`w-full mt-6 py-3 px-4 rounded-xl font-semibold text-white transition-all ${
                    selectedTicket 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  disabled={!selectedTicket}
                >
                  Register Now
                </button>
              </div>

              {/* Share Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Share Event</h3>
                <div className="flex gap-2">
                  <button className="flex-1 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Facebook className="w-5 h-5 text-blue-600 mx-auto" />
                  </button>
                  <button className="flex-1 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Twitter className="w-5 h-5 text-blue-400 mx-auto" />
                  </button>
                  <button className="flex-1 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Linkedin className="w-5 h-5 text-blue-700 mx-auto" />
                  </button>
                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="flex-1 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Bookmark className={`w-5 h-5 mx-auto ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventsPageTemplate
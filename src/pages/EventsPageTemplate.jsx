import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Share2,
  Bookmark,
  Tag,
  Globe,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  ChevronRight,
  Star,
  Check,
  Instagram,
  Globe as WebsiteIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { img } from "framer-motion/client";
import { useParams } from "react-router-dom";
import SocialIcons from "../cmponent/common/SocialIcons";

const EventsPageTemplate = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const { id } = useParams();

  // Fetch event data function
  const fetchEventData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${apiUrl}single-event/${id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      if (response.data.status && response.data.data) {
        const eventData = response.data.data;

        // Transform API data to match component structure
        const transformedEvent = {
          id: eventData.id,
          title: eventData.title,
          subtitle: eventData.description,
          image: eventData.image,
          date: formatDate(eventData.date),
          endDate: eventData.end_date
            ? formatDate(eventData.end_date)
            : formatDate(eventData.date),
          time: `${formatTime(eventData.start_time)} - ${formatTime(
            eventData.end_time
          )}`,
          location: eventData.location,
          location_url: eventData.location_url,

          organizer: {
            name: eventData.organizer_name,
            logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop",
            verified: true,
          },
          description: eventData.description,
          guests: eventData.guests || [],
          social_links: eventData.social_links || {},
          start_time: eventData.start_time,
          end_time: eventData.end_time,
          rawDate: eventData.date,
          rawEndDate: eventData.end_date,
        };

        setEventDetails(transformedEvent);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching event data:", err);
      setError(err.message);
      toast.error("Failed to load event details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper functions to format date and time
  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "TBD";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Generate JSON-LD structured data for SEO
  const generateStructuredData = () => {
    if (!eventDetails) return null;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": eventDetails.title,
      "description": eventDetails.subtitle,
      "image": eventDetails.image,
      "startDate": eventDetails.rawDate ? `${eventDetails.rawDate}T${eventDetails.start_time}` : undefined,
      "endDate": eventDetails.rawEndDate ? `${eventDetails.rawEndDate}T${eventDetails.end_time}` : undefined,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": eventDetails.location,
        "address": eventDetails.location
      },
      "organizer": {
        "@type": "Organization",
        "name": eventDetails.organizer.name,
        "url": eventDetails.social_links?.website || window.location.origin
      },
      "performer": eventDetails.guests?.map(guest => ({
        "@type": "Person",
        "name": guest.guest_name,
        "jobTitle": guest.guest_designation
      }))
    };

    // Remove undefined values
    Object.keys(structuredData).forEach(key => 
      structuredData[key] === undefined && delete structuredData[key]
    );

    return structuredData;
  };

  useEffect(() => {
    fetchEventData();
  }, [id]);

  // Inject structured data when event details are loaded
  useEffect(() => {
    if (eventDetails) {
      const structuredData = generateStructuredData();
      if (structuredData) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(structuredData);
        script.id = 'event-structured-data';
        
        // Remove existing script if present
        const existingScript = document.getElementById('event-structured-data');
        if (existingScript) {
          existingScript.remove();
        }
        
        document.head.appendChild(script);

        // Cleanup on unmount
        return () => {
          const scriptToRemove = document.getElementById('event-structured-data');
          if (scriptToRemove) {
            scriptToRemove.remove();
          }
        };
      }
    }
  }, [eventDetails]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !eventDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn't load the event details.
          </p>
          <button
            onClick={fetchEventData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-gradient-to-b from-gray-50 to-white" itemScope itemType="https://schema.org/Event">
      {/* Hero Section */}
      <header className="relative h-96 overflow-hidden">
        <img
          src={eventDetails.image}
          alt={`${eventDetails?.image_alt} - Event cover image`}
          className="w-full h-full object-cover"
          itemProp="image"
          loading="eager"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-2" itemProp="name" aria-label={eventDetails.title_meta || eventDetails.title}>
              {eventDetails.title}
            </h3>
            <p className="text-xl text-white/90 mb-6" itemProp="description" aria-label={eventDetails.subtitle_meta || eventDetails.subtitle}>
              {eventDetails.subtitle}
            </p>

            {/* Quick Info with semantic markup */}
            <div className="flex flex-wrap gap-6 text-white">
              <div className="flex items-center gap-2" itemProp="startDate" content={eventDetails.rawDate}>
                <Calendar className="w-5 h-5" aria-hidden="true" />
                <time dateTime={eventDetails.rawDate}>
                  {eventDetails.date}
                  {eventDetails.endDate && ` - ${eventDetails.endDate}`}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" aria-hidden="true" />
                <span>{eventDetails.time}</span>
              </div>
              <div className="flex items-center gap-2" itemProp="location" itemScope itemType="https://schema.org/Place">
                <MapPin className="w-5 h-5" aria-hidden="true" />
                <span itemProp="name">{eventDetails.location}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Event
              </h2>
              <div className="prose prose-lg text-gray-600 default-style" itemProp="description" aria-label={eventDetails?.description_meta} >
                <div dangerouslySetInnerHTML={{__html:eventDetails.description}}></div>
              </div>
            </section>

            {/* Guests/Speakers Section */}
            {eventDetails.guests && eventDetails.guests.length > 0 && (
              <section className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Featured Guests
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {eventDetails.guests.map((guest, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                      itemProp="performer"
                      itemScope
                      itemType="https://schema.org/Person"
                    >
                      <div className="flex-shrink-0">
                        {guest.guest_image ? (
                          <img
                            src={guest.guest_image}
                            alt={`${guest.guest_name} - ${guest.guest_designation}`}
                            className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100 group-hover:ring-blue-100 transition-all"
                            itemProp="image"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center ring-4 ring-gray-100 group-hover:ring-blue-100 transition-all ${
                            guest.guest_image ? "hidden" : "flex"
                          }`}
                          aria-hidden="true"
                        >
                          <span className="text-white font-bold text-lg">
                            {guest.guest_name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate" itemProp="name">
                          {guest.guest_name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2" itemProp="jobTitle">
                          {guest.guest_designation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Location Section */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Event Location
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-2">
                      {eventDetails.location}
                    </p>
                    {eventDetails.location_url && (
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={eventDetails.location_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                          aria-label={`View ${eventDetails.location} location on map`}
                        >
                          <Globe className="w-4 h-4" aria-hidden="true" />
                          <span className="font-medium">View Location</span>
                        </a>

                        {eventDetails.location_url.includes("google.com/maps") && (
                          <a
                            href={eventDetails.location_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                            aria-label={`Open ${eventDetails.location} in Google Maps`}
                          >
                            <MapPin className="w-4 h-4" aria-hidden="true" />
                            <span className="font-medium">Open in Maps</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-18 space-y-6">
              {/* Organizer Card */}
              <section className="bg-white rounded-2xl shadow-lg p-6" itemProp="organizer" itemScope itemType="https://schema.org/Organization">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Organized By
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900" itemProp="name">
                        {eventDetails.organizer.name}
                      </p>
                      {eventDetails.organizer.verified && (
                        <Check className="w-4 h-4 text-blue-600 fill-blue-100" aria-label="Verified organizer" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Verified Organizer</p>
                  </div>
                </div>
              </section>

              {/* Share Section */}
              <section className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Share Event
                </h3>
                <nav className="flex gap-2" aria-label="Social media links">
                  {eventDetails.social_links &&
                    Object.keys(eventDetails.social_links).length > 0 && (
                      <div className="mt-4">
                        <div className="flex gap-2">
                          {Object.entries(eventDetails.social_links).map(
                            ([platform, url]) => (
                              <a
                                key={platform}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                aria-label={`Share on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
                              >
                                <SocialIcons platform={platform} />
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </nav>
              </section>
            </div>
          </aside>
        </div>
      </main>
    </article>
  );
};

export default EventsPageTemplate;
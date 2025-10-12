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

      // console.log("event details --->:: ", response.data.data);
      if (response.data.status && response.data.data) {
        const eventData = response.data.data;
        // console.log("event details :: ", eventData.guests);

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
            logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop", // Default organizer logo
            verified: true,
          },
          description: eventData.description,
          guests: eventData.guests || [],
          social_links: eventData.social_links || {},
          start_time: eventData.start_time,
          end_time: eventData.end_time,
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

  

  useEffect(() => {
    fetchEventData();
  }, [id]);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={eventDetails.image}
          alt={eventDetails.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              {/* <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-white font-semibold">
                  {eventDetails.rating}
                </span>
                <span className="text-white/80 text-sm">
                  ({eventDetails.reviews} reviews)
                </span>
              </div> */}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {eventDetails.title}
            </h1>
            <p className="text-xl text-white/90 mb-6">
              {eventDetails.subtitle}
            </p>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-6 text-white">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {eventDetails.date}{" "}
                  {eventDetails.endDate && `- ${eventDetails.endDate}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{eventDetails.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{eventDetails.location}</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{eventDetails.attendees}+ Attendees</span>
              </div> */}
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Event
              </h2>
              <div className="prose prose-lg text-gray-600 default-style" >
                <p dangerouslySetInnerHTML={{__html:eventDetails.description}}></p>
              </div>
            </div>

            {/* Guests/Speakers Section */}
            {eventDetails.guests && eventDetails.guests.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Featured Guests
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {eventDetails.guests.map((guest, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex-shrink-0">
                        {guest.guest_image ? (
                          <img
                            src={guest.guest_image}
                            alt={guest.guest_name}
                            className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-100 group-hover:ring-blue-100 transition-all"
                            onError={(e) => {
                              // Fallback to initial if image fails to load
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center ring-4 ring-gray-100 group-hover:ring-blue-100 transition-all ${
                            guest.guest_image ? "hidden" : "flex"
                          }`}
                        >
                          <span className="text-white font-bold text-lg">
                            {guest.guest_name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {guest.guest_name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {guest.guest_designation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Section - Smart Link */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Event Location
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
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
                        >
                          <Globe className="w-4 h-4" />
                          <span className="font-medium">View Location</span>
                        </a>

                        {/* Optional: Direct Google Maps link if it's a Google URL */}
                        {eventDetails.location_url.includes(
                          "google.com/maps"
                        ) && (
                          <a
                            href={eventDetails.location_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">Open in Maps</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-18 space-y-6">
              {/* Organizer Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Organized By
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        {eventDetails.organizer.name}
                      </p>
                      {eventDetails.organizer.verified && (
                        <Check className="w-4 h-4 text-blue-600 fill-blue-100" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Verified Organizer</p>
                  </div>
                </div>
              </div>

              {/* Share Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Share Event
                </h3>
                <div className="flex gap-2">
                  {/* Social Links */}
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
                                title={
                                  platform.charAt(0).toUpperCase() +
                                  platform.slice(1)
                                }
                              >
                                {/* {getSocialIcon(platform)} */}
                                 <SocialIcons platform={platform} />
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPageTemplate;

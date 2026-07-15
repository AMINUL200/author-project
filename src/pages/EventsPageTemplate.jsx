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
  Play,
  Image,
  Youtube,
  ChevronLeft,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import SocialIcons from "../cmponent/common/SocialIcons";

const EventsPageTemplate = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const { id } = useParams();

  const ITEMS_PER_PAGE = 6; // 2 rows x 3 columns

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
        params: {
          t: Date.now(),
        },
      });
      console.log("Event API response:", response.data);
      if (response.data.status && response.data.data) {
        const eventData = response.data.data;

        // Filter active galleries only (is_active === true)
        const activeGalleries = eventData.galleries?.filter(
          gallery => gallery.is_active === true
        ) || [];

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
            eventData.end_time,
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
          galleries: activeGalleries, // Store active galleries only
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

  // Get YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Check if URL is a YouTube URL
  const isYouTubeUrl = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Get embed URL for YouTube
  const getYouTubeEmbedUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  // Pagination logic
  const galleryData = eventDetails?.galleries || [];
  const totalPages = Math.ceil(galleryData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = galleryData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: document.getElementById("gallery-section").offsetTop - 100,
      behavior: "smooth",
    });
  };

  const openModal = (item) => {
    setSelectedMedia(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
  };

  // Generate JSON-LD structured data for SEO
  const generateStructuredData = () => {
    if (!eventDetails) return null;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: eventDetails.title,
      description: eventDetails.subtitle,
      image: eventDetails.image,
      startDate: eventDetails.rawDate
        ? `${eventDetails.rawDate}T${eventDetails.start_time}`
        : undefined,
      endDate: eventDetails.rawEndDate
        ? `${eventDetails.rawEndDate}T${eventDetails.end_time}`
        : undefined,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      location: {
        "@type": "Place",
        name: eventDetails.location,
        address: eventDetails.location,
      },
      organizer: {
        "@type": "Organization",
        name: eventDetails.organizer.name,
        url: eventDetails.social_links?.website || window.location.origin,
      },
      performer: eventDetails.guests?.map((guest) => ({
        "@type": "Person",
        name: guest.guest_name,
        jobTitle: guest.guest_designation,
      })),
    };

    Object.keys(structuredData).forEach(
      (key) => structuredData[key] === undefined && delete structuredData[key],
    );

    return structuredData;
  };

  useEffect(() => {
    fetchEventData();
  }, [id]);

  useEffect(() => {
    if (eventDetails) {
      const structuredData = generateStructuredData();
      if (structuredData) {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.text = JSON.stringify(structuredData);
        script.id = "event-structured-data";

        const existingScript = document.getElementById("event-structured-data");
        if (existingScript) {
          existingScript.remove();
        }

        document.head.appendChild(script);

        return () => {
          const scriptToRemove = document.getElementById(
            "event-structured-data",
          );
          if (scriptToRemove) {
            scriptToRemove.remove();
          }
        };
      }
    }
  }, [eventDetails]);

  // Render media item based on type
  const renderMediaItem = (item) => {
    const isVideo = item.type === "video";
    const isUrl = item.type === "url";
    const isImage = item.type === "image";
    
    // For URL type, check if it's a YouTube URL
    const isYouTube = isUrl && isYouTubeUrl(item.file);
    const embedUrl = isYouTube ? getYouTubeEmbedUrl(item.file) : null;

    let thumbnail = item.file;
    let mediaType = item.type;

    // For YouTube URLs, we can use a thumbnail
    if (isYouTube) {
      const videoId = getYouTubeVideoId(item.file);
      thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : item.file;
      mediaType = 'youtube';
    }

    return (
      <div
        key={item.id}
        className="relative group cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
        onClick={() => openModal(item)}
      >
        {isImage ? (
          <img
            src={item.file}
            alt={item.title || item.image_alt || 'Gallery item'}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (isVideo || isYouTube) ? (
          <div className="relative w-full h-56 bg-gray-900">
            <img
              src={thumbnail}
              alt={item.title || 'Video thumbnail'}
              className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-blue-600 ml-1" fill="blue" />
              </div>
            </div>
          </div>
        ) : (
          // Default for URL type
          <div className="w-full h-56 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 truncate px-4">{item.file}</p>
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-sm font-medium truncate">
            {item.title || item.image_alt || 'Untitled'}
          </p>
          <span className="text-white/70 text-xs flex items-center gap-1">
            {isImage ? (
              <Image size={12} />
            ) : (isVideo || isYouTube) ? (
              <Youtube size={12} />
            ) : (
              <Globe size={12} />
            )}
            {isImage ? "Image" : isVideo ? "Video" : isYouTube ? "YouTube" : "Link"}
          </span>
        </div>
      </div>
    );
  };

  // Render media modal content
  const renderModalContent = (item) => {
    const isImage = item.type === "image";
    const isVideo = item.type === "video";
    const isUrl = item.type === "url";
    const isYouTube = isUrl && isYouTubeUrl(item.file);
    const embedUrl = isYouTube ? getYouTubeEmbedUrl(item.file) : null;

    if (isImage) {
      return (
        <img
          src={item.file}
          alt={item.title || item.image_alt || 'Gallery item'}
          className="w-full h-auto max-h-[80vh] object-contain"
        />
      );
    } else if (isVideo) {
      return (
        <video className="w-full h-auto max-h-[80vh] object-contain" controls autoPlay>
          <source src={item.file} />
          Your browser does not support the video tag.
        </video>
      );
    } else if (isYouTube && embedUrl) {
      return (
        <div className="aspect-video">
          <iframe
            src={embedUrl}
            title={item.title || 'YouTube video'}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    } else if (isUrl) {
      return (
        <div className="p-8 text-center">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700 mb-2">External Link</p>
          <a
            href={item.file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {item.file}
          </a>
        </div>
      );
    }
    return null;
  };

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
    <article
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      itemScope
      itemType="https://schema.org/Event"
    >
      {/* Hero Section */}
      <header
        className="relative h-[50vh] min-h-[400px] max-h-[650px] w-full overflow-hidden bg-gray-100"
        role="banner"
        aria-label="Event cover image"
      >
        <img
          src={eventDetails.image}
          alt={eventDetails.title || "Event cover image"}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Event Title and Details */}
        <div className="mb-10">
          <h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-3"
            itemProp="name"
          >
            {eventDetails.title}
          </h1>
          <p
            className="text-xl text-gray-700 mb-6"
            itemProp="description"
            dangerouslySetInnerHTML={{ __html: eventDetails.subtitle }}
          />

          <div className="flex flex-wrap gap-6 text-gray-700">
            <div
              className="flex items-center gap-2"
              itemProp="startDate"
              content={eventDetails.rawDate}
            >
              <Calendar className="w-5 h-5 text-blue-600" aria-hidden="true" />
              <time dateTime={eventDetails.rawDate}>
                {eventDetails.date}
                {eventDetails.endDate && ` - ${eventDetails.endDate}`}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" aria-hidden="true" />
              <span>{eventDetails.time}</span>
            </div>
            <div
              className="flex items-center gap-2"
              itemProp="location"
              itemScope
              itemType="https://schema.org/Place"
            >
              <MapPin className="w-5 h-5 text-blue-600" aria-hidden="true" />
              <span itemProp="name">{eventDetails.location}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About This Event
              </h2>
              <div
                className="prose prose-lg text-gray-600 default-style"
                itemProp="description"
                dangerouslySetInnerHTML={{ __html: eventDetails.description }}
              />
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
                        <h3
                          className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate"
                          itemProp="name"
                        >
                          {guest.guest_name}
                        </h3>
                        <p
                          className="text-sm text-gray-600 line-clamp-2"
                          itemProp="jobTitle"
                        >
                          {guest.guest_designation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-18 space-y-6">
              {/* Organizer Card */}
              <section
                className="bg-white rounded-2xl shadow-lg p-6"
                itemProp="organizer"
                itemScope
                itemType="https://schema.org/Organization"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Organized By
                </h3>
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p
                        className="font-semibold text-gray-900"
                        itemProp="name"
                      >
                        {eventDetails.organizer.name}
                      </p>
                      {eventDetails.organizer.verified && (
                        <Check
                          className="w-4 h-4 text-blue-600 fill-blue-100"
                          aria-label="Verified organizer"
                        />
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
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </nav>
              </section>
            </div>
          </aside>
        </div>

        {/* Event Gallery Section - Only show if there are active galleries */}
        {galleryData.length > 0 && (
          <section
            id="gallery-section"
            className="bg-white rounded-2xl shadow-lg p-8 mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Event Gallery</h2>
              <span className="text-sm text-gray-500">
                {galleryData.length} items
              </span>
            </div>

            {/* Gallery Grid - 2 rows */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentItems.map((item) => renderMediaItem(item))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Modal for viewing media */}
      {isModalOpen && selectedMedia && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            {renderModalContent(selectedMedia)}

            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedMedia.title || selectedMedia.image_alt || 'Untitled'}
              </h3>
              <p className="text-sm text-gray-500">
                {selectedMedia.type === "image" ? "Image" : 
                 selectedMedia.type === "video" ? "Video" : 
                 isYouTubeUrl(selectedMedia.file) ? "YouTube Video" : "Link"}
                {" • "}Click outside to close
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

export default EventsPageTemplate;
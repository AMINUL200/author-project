import React, { useEffect } from "react";
import {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  ArrowRight,
} from "lucide-react";
import Skeleton from "../common/Skeleton";
import { useNavigate } from "react-router-dom";

const AuthorBio = ({ sectionTitle = {}, authorInfo, loading = false, error = null }) => {
  const navigate = useNavigate();

  // ✅ Structured Data for Author
  useEffect(() => {
    if (authorInfo) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: authorInfo.name,
        image: authorInfo.image1 || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
        affiliation: authorInfo.affiliation,
        description: authorInfo.description,
        sameAs: [
          authorInfo.social_links?.twitter,
          authorInfo.social_links?.linkedin,
          authorInfo.social_links?.facebook,
          authorInfo.social_links?.instagram,
        ].filter(Boolean),
      };

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [authorInfo]);

  if (loading) {
    return (
      <section className="py-20 bg-white flex justify-center">
        <div className="w-full max-w-4xl space-y-4 px-4">
          <Skeleton className="w-40 h-40 rounded-full mx-auto" />
          <Skeleton className="w-3/4 h-8 mx-auto" />
          <Skeleton className="w-full h-24 mx-auto" />
          <Skeleton className="w-1/2 h-6 mx-auto" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  const getAuthorImage = () => authorInfo?.image1 || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";

  const handleSocialClick = (url) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      className="md:min-h-screen bg-white flex items-center justify-center p-6"
      id="bio"
      aria-labelledby="author-bio-heading"
    >
      <div className="max-w-6xl w-full bg-white overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Content */}
          <div className="p-12 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h2
                id="author-bio-heading"
                className="text-5xl font-bold text-gray-900 leading-tight"
              >
                {authorInfo?.name}
              </h2>
              <p className="text-xl text-indigo-600 font-medium">
                {authorInfo?.affiliation}
              </p>
            </div>

            {/* Social Links */}
            {authorInfo?.social_links && (
              <div className="flex justify-start gap-6 mb-8">
                {authorInfo.social_links.twitter && (
                  <button
                    onClick={() => handleSocialClick(authorInfo.social_links.twitter)}
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    aria-label="Twitter"
                  >
                    <Twitter size={24} />
                  </button>
                )}
                {authorInfo.social_links.linkedin && (
                  <button
                    onClick={() => handleSocialClick(authorInfo.social_links.linkedin)}
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={24} />
                  </button>
                )}
                {authorInfo.social_links.facebook && (
                  <button
                    onClick={() => handleSocialClick(authorInfo.social_links.facebook)}
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    aria-label="Facebook"
                  >
                    <Facebook size={24} />
                  </button>
                )}
                {authorInfo.social_links.instagram && (
                  <button
                    onClick={() => handleSocialClick(authorInfo.social_links.instagram)}
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    aria-label="Instagram"
                  >
                    <Instagram size={24} />
                  </button>
                )}
              </div>
            )}

            <p
              className="text-gray-600 leading-relaxed text-lg line-clamp-8 default-style"
              dangerouslySetInnerHTML={{ __html: authorInfo?.description }}
              aria-label={authorInfo?.description_seo}
            />

            {/* Read More Button */}
            <button
              onClick={() => navigate("/bio-details")}
              className="group mt-6 inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl w-fit"
            >
              Read More
              <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right Side - Image */}
          <div className="relative bg-gradient-to-br bg-white">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative bg-white h-full flex items-center justify-center pt-10 md:p-20">
              <div
                className="relative z-10 w-70 md:w-100 h-80 md:h-120 rounded-3xl border border-black/20 overflow-hidden transform hover:rotate-0 transition-transform duration-500"
                style={{ boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px" }}
              >
                <img
                  src={getAuthorImage()}
                  alt={authorInfo?.image1_alt || "Author profile picture"}
                  className="w-full h-full rounded object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorBio;

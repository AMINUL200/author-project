import { Facebook, Linkedin, Twitter, Instagram, BookOpen, Award, Users, TrendingUp, Mail } from "lucide-react";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-300 ${className}`}></div>
);

const AuthorHighlight = ({ authorInfo, loading = false, error = null }) => {
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

  if (!authorInfo || Object.keys(authorInfo).length === 0) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-gray-500">No Author Information Available</p>
      </section>
    );
  }

  const getAuthorImage = () => {
    if (authorInfo?.image1) return authorInfo.image1;
    return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
  };

  const handleSocialClick = (platform, url) => {
    if (url && url !== "http://127.0.0.1:8000/api/author") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Process achievements string into array if needed
  const getAchievementsArray = () => {
    if (Array.isArray(authorInfo.achievements)) {
      return authorInfo.achievements;
    }
    if (typeof authorInfo.achievements === 'string') {
      return authorInfo.achievements.split(',').map(item => item.trim());
    }
    return [];
  };

  // Split description into paragraphs
  const descriptionParagraphs = authorInfo?.description?.split('\n\n') || [];

  return (
    <section className="py-16 bg-white" id="bio">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-2">
            Bio
          </h1>
        </div>

        {/* Author Image - Left Aligned */}
        <div className="mb-8">
          <img
            src={getAuthorImage()}
            alt={authorInfo?.name}
            className="w-48 h-48 rounded object-cover shadow-md float-left mr-8 mb-4"
          />
          
          {/* Bio Text - Flows around image */}
          <div className="text-gray-800 leading-relaxed space-y-4">
            {descriptionParagraphs.length > 0 ? (
              descriptionParagraphs.map((paragraph, index) => (
                <p key={index} className="text-lg font-serif">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="text-lg font-serif">
                {authorInfo?.description || `Welcome to the professional profile of ${authorInfo?.name}.`}
              </p>
            )}
          </div>
        </div>

        {/* Clear float */}
        <div className="clear-both"></div>

        {/* Achievements Section with Right Image */}
        {(() => {
          const achievements = getAchievementsArray();
          if (achievements.length > 0) {
            return (
              <div className="mt-12 mb-12">
                <img
                  src={authorInfo?.image2 || "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop"}
                  alt={`${authorInfo?.name}'s achievements`}
                  className="w-64 h-48 rounded object-cover shadow-md float-right ml-8 mb-4"
                />
                <div className="text-gray-800 leading-relaxed space-y-4">
                  <p className="text-lg font-serif">
                    <strong>{authorInfo?.name}</strong>'s work has garnered significant recognition throughout their career. Key achievements include:
                  </p>
                  <ul className="list-disc list-inside text-lg font-serif space-y-2">
                    {achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
                <div className="clear-both"></div>
              </div>
            );
          }
          return null;
        })()}

        {/* Expertise as flowing text */}
        {authorInfo?.expertise && authorInfo.expertise.length > 0 && (
          <div className="mb-12">
            <p className="text-lg font-serif text-gray-800 leading-relaxed">
              <strong>{authorInfo.name}</strong> specializes in {authorInfo.expertise.join(', ').toLowerCase()}, bringing a wealth of knowledge and experience to each project.
            </p>
          </div>
        )}

        {/* Tagline */}
        {authorInfo?.tagline && (
          <div className="mb-12">
            <p className="text-xl font-serif italic text-gray-700 leading-relaxed border-l-4 border-gray-300 pl-6">
              "{authorInfo.tagline}"
            </p>
          </div>
        )}

        {/* Contact/Social Section */}
        <div className="text-center mt-12">
          {authorInfo?.country && (
            <p className="text-gray-600 mb-6 text-lg font-serif">
              Based in {authorInfo.country}
            </p>
          )}

          {/* Social Media Links - Simple */}
          {authorInfo?.social_links && (
            <div className="flex justify-center gap-6 mb-8">
              {authorInfo.social_links.twitter && (
                <button
                  onClick={() => handleSocialClick("twitter", authorInfo.social_links.twitter)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={24} />
                </button>
              )}
              {authorInfo.social_links.linkedin && (
                <button
                  onClick={() => handleSocialClick("linkedin", authorInfo.social_links.linkedin)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </button>
              )}
              {authorInfo.social_links.facebook && (
                <button
                  onClick={() => handleSocialClick("facebook", authorInfo.social_links.fb)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={24} />
                </button>
              )}
              {authorInfo.social_links.instagram && (
                <button
                  onClick={() => handleSocialClick("instagram", authorInfo.social_links.instagram)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={24} />
                </button>
              )}
            </div>
          )}

          {/* Call to Action */}
          {authorInfo?.affiliation && (
            <p className="text-lg font-serif text-gray-700 italic">
              {authorInfo.affiliation}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AuthorHighlight;
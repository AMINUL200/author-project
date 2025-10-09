import {
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  BookOpen,
  Award,
  Users,
  TrendingUp,
  Mail,
} from "lucide-react";

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-300 ${className}`}></div>
);

const AuthorHighlight = ({
  sectionTitle = {},
  authorInfo,
  loading = false,
  error = null,
}) => {
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
    if (typeof authorInfo.achievements === "string") {
      return authorInfo.achievements.split(",").map((item) => item.trim());
    }
    return [];
  };

  // Split description into paragraphs
  const descriptionParagraphs = authorInfo?.description?.split("\n\n") || [];

  return (
    <section
      className="relative pb-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen overflow-hidden"
      id="about"
    >
      {/* 🌊 Animated Wave Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <style>{`
          @keyframes wave1 {
            0%, 100% { transform: translateX(0) translateY(0); }
            50% { transform: translateX(-25%) translateY(-10px); }
          }
          @keyframes wave2 {
            0%, 100% { transform: translateX(0) translateY(0); }
            50% { transform: translateX(-15%) translateY(15px); }
          }
          @keyframes wave3 {
            0%, 100% { transform: translateX(0) translateY(0); }
            50% { transform: translateX(-20%) translateY(-20px); }
          }
          @keyframes wave4 {
            0%, 100% { transform: translateX(0) translateY(0); }
            50% { transform: translateX(-30%) translateY(25px); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
        `}</style>

        {/* Multiple layered waves with different speeds */}
        <div className="absolute inset-0">
          {/* Wave layer 1 - Bottom */}
          <svg
            className="absolute bottom-0 left-0 w-full h-48 opacity-30"
            style={{ animation: "wave1 15s ease-in-out infinite" }}
            preserveAspectRatio="none"
            viewBox="0 0 1440 320"
          >
            <path
              fill="rgba(147, 197, 253, 0.4)"
              d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,133.3C672,117,768,107,864,122.7C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>

          {/* Wave layer 2 */}
          <svg
            className="absolute bottom-0 left-0 w-full h-48 opacity-30"
            style={{ animation: "wave2 12s ease-in-out infinite" }}
            preserveAspectRatio="none"
            viewBox="0 0 1440 320"
          >
            <path
              fill="rgba(196, 181, 253, 0.4)"
              d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,154.7C672,149,768,171,864,186.7C960,203,1056,213,1152,202.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>

          {/* Wave layer 3 - Middle */}
          <svg
            className="absolute top-1/4 left-0 w-full h-48 opacity-20"
            style={{ animation: "wave3 18s ease-in-out infinite" }}
            preserveAspectRatio="none"
            viewBox="0 0 1440 320"
          >
            <path
              fill="rgba(251, 207, 232, 0.4)"
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,208C672,213,768,203,864,181.3C960,160,1056,128,1152,128C1248,128,1344,160,1392,176L1440,192L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>

          {/* Wave layer 4 - Top */}
          <svg
            className="absolute top-0 left-0 w-full h-48 opacity-20"
            style={{ animation: "wave4 20s ease-in-out infinite" }}
            preserveAspectRatio="none"
            viewBox="0 0 1440 320"
          >
            <path
              fill="rgba(254, 215, 170, 0.3)"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,122.7C960,139,1056,149,1152,138.7C1248,128,1344,96,1392,80L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>

        {/* Floating subtle orbs */}
        <div
          className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"
          style={{ animation: "float 8s ease-in-out infinite" }}
        ></div>
        <div
          className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full blur-3xl"
          style={{
            animation: "float 10s ease-in-out infinite",
            animationDelay: "2s",
          }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-gradient-to-br from-purple-200/15 to-blue-200/15 rounded-full blur-3xl"
          style={{
            animation: "float 12s ease-in-out infinite",
            animationDelay: "4s",
          }}
        ></div>
      </div>
      {/* 🌈 Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs with gradient */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Animated waves */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C300,80 600,80 900,40 C1050,20 1150,0 1200,0 L1200,120 L0,120 Z"
            fill="rgba(255,255,255,0.1)"
            className="animate-pulse"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="M0,0 C300,80 600,80 900,40 C1050,20 1150,0 1200,0 L1200,120 L0,120 Z;
                      M0,0 C300,40 600,40 900,80 C1050,100 1150,120 1200,100 L1200,120 L0,120 Z;
                      M0,0 C300,80 600,80 900,40 C1050,20 1150,0 1200,0 L1200,120 L0,120 Z"
            />
          </path>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Simple Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold py-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {sectionTitle?.sec5_name}
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
                {authorInfo?.description ||
                  `Welcome to the professional profile of ${authorInfo?.name}.`}
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
                  src={
                    authorInfo?.image2 ||
                    "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop"
                  }
                  alt={`${authorInfo?.name}'s achievements`}
                  className="w-64 h-48 rounded object-cover shadow-md float-right ml-8 mb-4"
                />
                <div className="text-gray-800 leading-relaxed space-y-4">
                  <p className="text-lg font-serif">
                    <strong>{authorInfo?.name}</strong>'s work has garnered
                    significant recognition throughout their career. Key
                    achievements include:
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
              <strong>{authorInfo.name}</strong> specializes in{" "}
              {authorInfo.expertise.join(", ").toLowerCase()}, bringing a wealth
              of knowledge and experience to each project.
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
              {sectionTitle?.sec5_country_prefix} {authorInfo.country}
            </p>
          )}

          {/* Social Media Links - Simple */}
          {authorInfo?.social_links && (
            <div className="flex justify-center gap-6 mb-8">
              {authorInfo.social_links.twitter && (
                <button
                  onClick={() =>
                    handleSocialClick(
                      "twitter",
                      authorInfo.social_links.twitter
                    )
                  }
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={24} />
                </button>
              )}
              {authorInfo.social_links.linkedin && (
                <button
                  onClick={() =>
                    handleSocialClick(
                      "linkedin",
                      authorInfo.social_links.linkedin
                    )
                  }
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </button>
              )}
              {authorInfo.social_links.facebook && (
                <button
                  onClick={() =>
                    handleSocialClick("facebook", authorInfo.social_links.fb)
                  }
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={24} />
                </button>
              )}
              {authorInfo.social_links.instagram && (
                <button
                  onClick={() =>
                    handleSocialClick(
                      "instagram",
                      authorInfo.social_links.instagram
                    )
                  }
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

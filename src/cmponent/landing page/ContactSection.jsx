import React, { useEffect } from "react";
import {
  MapPin,
  Mail,
  Link as LinkIcon,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";

const ContactSection = ({ contact, loading = false, error = null }) => {

  // Structured Data for SEO
  useEffect(() => {
    if (contact) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: contact.title,
        url: contact.website,
        logo: "https://yourwebsite.com/logo.png", // replace with your logo
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: contact.phone || "",
            email: contact.email,
            contactType: "customer service",
          },
        ],
        sameAs: [
          contact.facebook,
          contact.instagram,
          contact.twitter,
          contact.linkedin,
        ].filter(Boolean),
        address: {
          "@type": "PostalAddress",
          streetAddress: contact.address || "",
        },
      };

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => document.head.removeChild(script);
    }
  }, [contact]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 text-lg">
        Loading contact info...
      </div>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section
      className="bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] text-white flex flex-col min-h-screen font-[Poppins]"
      aria-labelledby="contact-heading"
    >
      {/* Main Section */}
      <main className="flex-grow flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Side */}
          <div className="flex flex-col space-y-6 w-full md:w-1/2">
            <h2 id="contact-heading" className="text-3xl md:text-4xl font-bold mb-2">
              {contact.title}
            </h2>

            <div className="space-y-4" aria-label="Contact Information">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-gray-400" aria-hidden="true" />
                <p className="text-gray-200">{contact.address}</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-gray-400" aria-hidden="true" />
                <p className="text-gray-200">{contact.email}</p>
              </div>

              <div className="flex items-center gap-3">
                <LinkIcon className="w-6 h-6 text-gray-400" aria-hidden="true" />
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-blue-400 transition"
                >
                  {contact.website}
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-6 mt-8" aria-label="Social Media Links">
              {contact.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-transform hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {contact.instagram && (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-400 transition-transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {contact.twitter && (
                <a
                  href={contact.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-sky-400 transition-transform hover:scale-110"
                  aria-label="Twitter"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              )}
              {contact.facebook && (
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 flex justify-center">
            <img
              src="call2.png"
              alt={contact?.image_alt || "Contact us illustration"}
              className="rounded-2xl w-72 h-72 object-center shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              loading="lazy"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center border-t border-gray-700 py-4 text-sm text-gray-400">
        © 2025 Demo. All rights reserved.
      </footer>
    </section>
  );
};

export default ContactSection;

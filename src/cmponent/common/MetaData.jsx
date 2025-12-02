import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";

const MetaData = () => {
  const [meta, setMeta] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await axios.get(`${API_URL}meta-tags`, {
           params: {
          t: Date.now(), // prevent caching
        },
        });
        setMeta(res.data);
      } catch (err) {
        console.error("Failed to fetch meta data:", err);
      }
    };
    fetchMeta();
  }, []);

  if (!meta) return null;

  return (
    <Helmet>
      {/* Title & Description */}
      <title>{meta.meta_title}</title>
      <meta name="description" content={meta.meta_description} />
      <meta name="keywords" content={meta.meta_keywords} />
      <link rel="canonical" href={meta.canonical_tag} />

      {/* Open Graph */}
      <meta property="og:title" content={meta.meta_title} />
      <meta property="og:description" content={meta.meta_description} />
      <meta property="og:url" content={meta.canonical_tag} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:title" content={meta.meta_title} />
      <meta name="twitter:description" content={meta.meta_description} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

export default MetaData;

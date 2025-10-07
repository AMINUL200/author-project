import React, { useEffect, useState } from "react";
import HeroSection from "../cmponent/landing page/HeroSection";
import MostViewedArticles from "../cmponent/landing page/MostViewedArticles";
import LatestArticles from "../cmponent/landing page/LatestArticles";
import CategoriesSection from "../cmponent/landing page/CategoriesSection";
import AuthorHighlight from "../cmponent/landing page/AuthorHighlight";
import PricingSection from "../cmponent/landing page/PricingSection";
import TestimonialsSection from "../cmponent/landing page/TestimonialsSection";
import NewsletterSection from "../cmponent/landing page/NewsletterSection";
import CTABanner from "../cmponent/landing page/CTABanner";
import Footer from "../cmponent/common/Footer";
import { toast } from "react-toastify";
import axios from "axios";
import NewsAndEvent from "../cmponent/landing page/NewsAndEvent";
import EventGallery from "../cmponent/landing page/EventGallery";
import PreviousPublication from "../cmponent/landing page/PreviousPublication";
// import PublishedBook from '../cmponent/landing page/PublishedBook';
import PublishedBook from "../cmponent/common/PublishedBook";
import { useAuth } from "../context/AuthContext";

const LandingPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const {userData, token} = useAuth();

console.log(userData);

  const [heroData, setHeroData] = useState({});
  const [pricingPlans, setPricingPlans] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [authorInfo, setAuthorInfo] = useState({});
  const [publishedBookData, setPublishedBookData] = useState([]);
  const [featureBookData, setFeatureBookData] = useState([]);
  const [event, setEvent] = useState([]);

  const [loading, setLoading] = useState({
    hero: true,
    pricing: true,
    testimonials: true,
    author: true,
    publishedBook: true,
    featurebook: true,
    event: true,
  });

  const [error, setError] = useState({
    hero: null,
    pricing: null,
    testimonials: null,
    author: null,
    publishedBook: null,
    featurebook: null,
    event: null,
  });

  // 🔹 Fetch all APIs in parallel
  useEffect(() => {
    const fetchAll = async () => {
      const requests = {
        hero: axios.get(`${apiUrl}show-banner`),
        pricing: axios.get(`${apiUrl}all-subscription`),
        testimonials: axios.get(`${apiUrl}all-feedback`),
        author: axios.get(`${apiUrl}all-bio`),
        publishedBook: axios.get(`${apiUrl}article-list`),
        featurebook: axios.get(`${apiUrl}all-feature-update`),
        event: axios.get(`${apiUrl}all-event`),
      };

      Object.entries(requests).forEach(async ([key, req]) => {
        try {
          const res = await req;
          if (res.status === 200) {
            if (key === "hero") setHeroData(res.data.data || {});
            if (key === "pricing") setPricingPlans(res.data.data || []);
            if (key === "testimonials") setTestimonials(res.data.data || []);
            if (key === "author") setAuthorInfo(res.data.data || {});
            if (key === "publishedBook")
              setPublishedBookData(res.data.data || []);
            if (key === "featurebook") setFeatureBookData(res.data.data || []);
            if (key === "event") setEvent(res.data.data || {});
          } else {
            throw new Error(res.data.message || `Failed to fetch ${key}`);
          }
        } catch (err) {
          console.error(`Error fetching ${key}:`, err);
          setError((prev) => ({ ...prev, [key]: err.message }));
          toast.error(err.message || `Failed to fetch ${key}`);
        } finally {
          setLoading((prev) => ({ ...prev, [key]: false }));
        }
      });
    };

    fetchAll();
  }, [apiUrl]);

  return (
    <div className="min-h-screen">
      <HeroSection data={heroData} loading={loading.hero} error={error.hero} />

      <PublishedBook
        publishedBookData={publishedBookData}
        loading={loading.publishedBook}
        error={error.publishedBook}
      />

      <PreviousPublication
        featureBookData={featureBookData}
        loading={loading.featurebook}
        error={error.featurebook}
      />
      <EventGallery
        eventData={event}
        loading={loading.event}
        error={error.event}
      />

      <AuthorHighlight
        authorInfo={authorInfo}
        loading={loading.author}
        error={error.author}
      />
      <PricingSection
        plans={pricingPlans}
        loading={loading.pricing}
        error={error.pricing}
      />
      <TestimonialsSection
        testimonials={testimonials}
        loading={loading.testimonials}
        error={error.testimonials}
      />

      {/* <NewsletterSection /> */}
      <CTABanner />
      <Footer />
    </div>
  );
};

export default LandingPage;

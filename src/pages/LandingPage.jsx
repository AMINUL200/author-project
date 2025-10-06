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

const LandingPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [heroData, setHeroData] = useState({});
  const [pricingPlans, setPricingPlans] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  const [loading, setLoading] = useState({
    hero: true,
    pricing: true,
    testimonials: true,
  });

  const [error, setError] = useState({
    hero: null,
    pricing: null,
    testimonials: null,
  });

  // 🔹 Fetch all APIs in parallel
  useEffect(() => {
    const fetchAll = async () => {
      const requests = {
        hero: axios.get(`${apiUrl}show-banner`),
        pricing: axios.get(`${apiUrl}all-subscription`),
        testimonials: axios.get(`${apiUrl}all-feedback`),
      };

      Object.entries(requests).forEach(async ([key, req]) => {
        try {
          const res = await req;
          if (res.status === 200) {
            if (key === "hero") setHeroData(res.data.data || {});
            if (key === "pricing") setPricingPlans(res.data.data || []);
            if (key === "testimonials") setTestimonials(res.data.data || []);
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

      <PublishedBook />

      <PreviousPublication />
      <EventGallery />

      <AuthorHighlight
        // authorInfo={authorInfo}
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

      <NewsletterSection />
      <CTABanner />
      <Footer />
    </div>
  );
};

export default LandingPage;

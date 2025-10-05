import React, { useEffect, useState } from 'react';
import HeroSection from '../cmponent/landing page/HeroSection';
import MostViewedArticles from '../cmponent/landing page/MostViewedArticles';
import LatestArticles from '../cmponent/landing page/LatestArticles';
import CategoriesSection from '../cmponent/landing page/CategoriesSection';
import AuthorHighlight from '../cmponent/landing page/AuthorHighlight';
import PricingSection from '../cmponent/landing page/PricingSection';
import TestimonialsSection from '../cmponent/landing page/TestimonialsSection';
import NewsletterSection from '../cmponent/landing page/NewsletterSection';
import CTABanner from '../cmponent/landing page/CTABanner';
import Footer from '../cmponent/common/Footer';
import { toast } from 'react-toastify';
import axios from 'axios';
import NewsAndEvent from '../cmponent/landing page/NewsAndEvent';
import EventGallery from '../cmponent/landing page/EventGallery';

const LandingPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [mostViewedArticles, setMostViewedArticles] = useState([]);
  const [latestArticles, setLatestArticles] = useState([]);
  const [authorInfo, setAuthorInfo] = useState(null);
  const [categories, setCategories] = useState([]);
  const [pricingPlans, setPricingPlans] = useState([]);

  const [loading, setLoading] = useState({
    mostViewed: true,
    latest: true,
    author: true,
    categories: true,
    pricing: true,
  });

  const [error, setError] = useState({
    mostViewed: null,
    latest: null,
    author: null,
    categories: null,
    pricing: null,
  });

  // 🔹 Fetch all APIs in parallel
  useEffect(() => {
    const fetchAll = async () => {
      const requests = {
        mostViewed: axios.get(`${apiUrl}most_view_article`),
        latest: axios.get(`${apiUrl}latest_articale`),
        author: axios.get(`${apiUrl}authors`),
        categories: axios.get(`${apiUrl}categories`),
        pricing: axios.get(`${apiUrl}all-subscription`), // 🔹 new pricing API
      };

      Object.entries(requests).forEach(async ([key, req]) => {
        try {
          const res = await req;
          if (res.status === 200 && res.data.status) {
            if (key === "mostViewed") setMostViewedArticles(res.data.data || []);
            if (key === "latest") setLatestArticles(res.data.data || []);
            if (key === "author") setAuthorInfo(res.data.data[0] || null);
            if (key === "categories") setCategories(res.data.data || []);
            if (key === "pricing") setPricingPlans(res.data.data || []);
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
      <HeroSection />
      <MostViewedArticles 
        mostView={mostViewedArticles} 
        loading={loading.mostViewed} 
        error={error.mostViewed} 
      />
      <LatestArticles 
        latesView={latestArticles} 
        loading={loading.latest} 
        error={error.latest} 
      />
      {/* <CategoriesSection 
        categories={categories} 
        loading={loading.categories} 
        error={error.categories} 
      /> */}
      {/* <NewsAndEvent /> */}
      <EventGallery/>
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
      <TestimonialsSection />
      <NewsletterSection />
      <CTABanner />
      <Footer />
    </div>
  );
};

export default LandingPage;

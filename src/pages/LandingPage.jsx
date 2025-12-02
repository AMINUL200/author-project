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
import { data } from "react-router-dom";
import BooksReview from "../cmponent/landing page/BooksReview";
import AuthorBio from "../cmponent/landing page/AuthorBio";
import ContactSection from "../cmponent/landing page/ContactSection";

const LandingPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { userData, token } = useAuth();

  console.log(userData);

  const [heroData, setHeroData] = useState({});
  const [pricingPlans, setPricingPlans] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [authorInfo, setAuthorInfo] = useState({});
  const [publishedBookData, setPublishedBookData] = useState([]);
  const [featureBookData, setFeatureBookData] = useState([]);
  const [event, setEvent] = useState([]);
  const [sectionTitle, setSectionTitle] = useState([]);
  const [bookRevData, setBookRevData] = useState({});
  const [contactData, setContactData] = useState({});

  const [loading, setLoading] = useState({
    hero: true,
    pricing: true,
    testimonials: true,
    author: true,
    publishedBook: true,
    featurebook: true,
    event: true,
    review: true,
    contact: true,
  });

  const [error, setError] = useState({
    hero: null,
    pricing: null,
    testimonials: null,
    author: null,
    publishedBook: null,
    featurebook: null,
    event: null,
    review: null,
    contact: null,
  });

  useEffect(() => {
    const fetchSectionData = async () => {
      try {
        const response = await axios.get(`${apiUrl}sections`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            t: Date.now(), // prevent caching
          },
        });
        if (response.data.status) {
          // console.log("section title:: ", response.data.data);
          setSectionTitle(response.data.data);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };
    fetchSectionData();
  }, []);

  // 🔹 Fetch all APIs in parallel
  useEffect(() => {
    const fetchAll = async () => {
      const requests = {
        hero: axios.get(`${apiUrl}show-banner`, {
          params: {
            t: Date.now(), // prevent caching
          },
        }),
        pricing: axios.get(`${apiUrl}all-subscription`, {
          params: {
            t: Date.now(), // prevent caching
          },
        }),
        testimonials: axios.get(`${apiUrl}all-feedback`, {
          params: {
            t: Date.now(), // prevent caching
          },
        }),
        author: axios.get(`${apiUrl}all-bio`, {
          params: {
            t: Date.now(), // prevent caching
          },
        }),
        publishedBook: axios.get(`${apiUrl}article-list`, {
          params: {
            t: Date.now(), // prevent caching
          },
        }),
        featurebook: axios.get(`${apiUrl}all-feature-update`, {
          params: {
            t: Date.now(), // prevent caching
          },
        }),
        event: axios.get(`${apiUrl}all-event`, {
          params: {
            t: Date.now(), // prevent caching
          },
        }),
        review: axios.get(`${apiUrl}reviews`, {
          params: {
            t: Date.now(), // prevent caching
          },
        }),
        contact: axios.get(`${apiUrl}contacts`, {
          params: {
            t: Date.now(), // prevent caching
          },
        }),
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
            if (key === "review") setBookRevData(res.data.data || {});
            if (key === "contact") setContactData(res.data.data || {});
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
      <HeroSection
        sectionTitle={sectionTitle}
        data={heroData}
        loading={loading.hero}
        error={error.hero}
      />

      <PublishedBook
        sectionTitle={sectionTitle}
        publishedBookData={publishedBookData}
        loading={loading.publishedBook}
        error={error.publishedBook}
      />
      <BooksReview
        reviewData={bookRevData}
        loading={loading.review}
        error={error.review}
      />

      <PreviousPublication
        sectionTitle={sectionTitle}
        featureBookData={featureBookData}
        loading={loading.featurebook}
        error={error.featurebook}
      />
      <EventGallery
        sectionTitle={sectionTitle}
        eventData={event}
        loading={loading.event}
        error={error.event}
      />

      {/* <AuthorHighlight
        sectionTitle={sectionTitle}
        authorInfo={authorInfo}
        loading={loading.author}
        error={error.author}
      /> */}
      <AuthorBio
        sectionTitle={sectionTitle}
        authorInfo={authorInfo}
        loading={loading.author}
        error={error.author}
      />
      <PricingSection
        sectionTitle={sectionTitle}
        plans={pricingPlans}
        loading={loading.pricing}
        error={error.pricing}
      />
      <TestimonialsSection
        sectionTitle={sectionTitle}
        testimonials={testimonials}
        loading={loading.testimonials}
        error={error.testimonials}
      />

      {/* <NewsletterSection /> */}
      {/* <CTABanner sectionTitle={sectionTitle} />
      <Footer /> */}

      <ContactSection
        contact={contactData}
        loading={loading.contact}
        error={error.contact}
      />
    </div>
  );
};

export default LandingPage;

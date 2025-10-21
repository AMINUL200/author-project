import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { toast } from "react-toastify";

const BioProfile = () => {
  const [bio, setBio] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true)

  const fetchBio = async () => {
    try {
        const response = await axios.get(`${apiUrl}all-bio`);

        if(response.data.success){
            console.log("Bio info;; ",response.data.data);
            setBio(response.data.data);
            
        }else{
            toast.error(response.data.message)
        }
        
    } catch (error) {
        console.log(error);
        toast.error(error.message)
    }finally{
        setLoading(false)
    }
  }

  useEffect(() => {
    fetchBio();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-blue-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen flex justify-center items-start py-16 px-6">
      {/* Bio Card */}
      <div className="relative flex flex-col md:flex-row gap-10 bg-white shadow-2xl rounded-3xl p-10 md:p-16 max-w-6xl w-full">
        {/* Decorative Bubble */}
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-blue-300/30 blur-3xl rounded-full -z-10"></div>

        {/* Image Section - Fixed for sticky behavior */}
        <div className="flex-shrink-0 mx-auto md:mx-0">
          <div className="sticky top-20"> {/* Added sticky here */}
            <div className="absolute top-3 left-3 w-[340px] h-[480px] bg-gradient-to-br from-blue-400 to-blue-200 blur-3xl rounded-[35px] -z-10 rotate-[-5deg] hidden md:block"></div>
            <img
              src={bio?.image2}
              alt={bio?.image2_alts || "Author Image"}
              className="w-[340px] h-[480px] object-cover rounded-[30px] border-4 border-white shadow-[0_25px_60px_rgba(0,0,0,0.25),0_0_60px_rgba(100,149,237,0.3)] transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 text-gray-700">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">{bio?.name}</h1>
          <h2 className="text-lg text-gray-500 font-medium mb-6">{bio.tagline}</h2>

          <p className="text-gray-600 mb-6 leading-relaxed text-justify default-style" dangerouslySetInnerHTML={{__html:bio.description}}>
            {/* <span className="text-blue-700 font-semibold">{bio.name}</span> —{" "} */}
            {/* {bio.description} */}
          </p>

          {/* Achievements */}
          <div className="bg-indigo-50 border-l-4 border-blue-700 p-5 rounded-xl shadow-md mt-6">
            <h3 className="text-blue-700 text-lg font-semibold mb-3">
              Key Achievements:
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {bio.achievements
                .split(",")
                .map((ach, i) => <li key={i}>{ach.trim()}</li>)}
            </ul>
          </div>

          {/* Expertise Tags */}
          {bio.expertise?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {bio.expertise.map((item, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-6 mt-8 text-blue-700">
            {bio.social_links?.linkedin && (
              <a
                href={bio.social_links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition"
              >
                <Linkedin size={24} />
              </a>
            )}
            {bio.social_links?.facebook && (
              <a
                href={bio.social_links.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition"
              >
                <Facebook size={24} />
              </a>
            )}
            {bio.social_links?.instagram && (
              <a
                href={bio.social_links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition"
              >
                <Instagram size={24} />
              </a>
            )}
            {bio.social_links?.twitter && (
              <a
                href={bio.social_links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition"
              >
                <Twitter size={24} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioProfile;
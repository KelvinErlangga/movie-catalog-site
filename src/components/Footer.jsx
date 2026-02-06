import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full relative z-10 dark:bg-neutral-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
      
      {/* Container Konten */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* KOLOM 1: BRAND & DESKRIPSI */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-extrabold tracking-tight no-underline flex items-center">
              {/* Text CINEMA berubah jadi putih saat dark mode */}
              <span className="text-gray-900 dark:text-white transition-colors">CINEMA</span>
              <span className="text-blue-600 dark:text-blue-500 ml-1 transition-colors">VIN</span>
            </Link>
            
            {/* Deskripsi */}
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed text-justify transition-colors">
              Platform streaming film terbaik dengan koleksi terlengkap dari berbagai negara. Nikmati pengalaman menonton tanpa batas dengan kualitas terbaik.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><FaFacebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"><FaTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-colors"><FaInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"><FaYoutube size={20} /></a>
            </div>
          </div>

          {/* KOLOM 2: QUICK LINKS */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-6 text-lg transition-colors">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">
                  Home
                </Link>
              </li>
              <li>
                <a href="#popular" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">
                  Popular Movies
                </a>
              </li>
              <li>
                <a href="#top_rated" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">
                  Top Rated
                </a>
              </li>
              <li>
                <a href="#now_playing" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">
                  Now Playing
                </a>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: CATEGORIES */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-6 text-lg transition-colors">Categories</h3>
            <ul className="space-y-4 text-sm">
              <li><span className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Action</span></li>
              <li><span className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Comedy</span></li>
              <li><span className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Drama</span></li>
              <li><span className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Horror</span></li>
            </ul>
          </div>

          {/* KOLOM 4: SUPPORT */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-6 text-lg transition-colors">Support</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">Help Center</a></li>
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">Terms of Service</a></li>
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">Contact Us</a></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR: COPYRIGHT */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center transition-colors">
          <p className="text-gray-400 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Kelvin Erlangga Satriagung. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-gray-400">
             <FaGithub size={20} className="hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors"/>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
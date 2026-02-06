import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaGithub } from 'react-icons/fa';
import { useTranslation } from 'react-i18next'; // 1. IMPORT

const Footer = () => {
  // 2. GUNAKAN HOOK
  const { t } = useTranslation();

  return (
    <footer className="w-full relative z-10 dark:bg-neutral-900 border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 transition-colors duration-300">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* KOLOM 1: BRAND & DESKRIPSI */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-extrabold tracking-tight no-underline flex items-center">
              <span className="text-gray-900 dark:text-white transition-colors">CINEMA</span>
              <span className="text-blue-600 dark:text-blue-500 ml-1 transition-colors">VIN</span>
            </Link>
            
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed text-justify transition-colors">
              {/* TRANSLATE DESKRIPSI */}
              {t('footer.description')}
            </p>
            
            <div className="flex space-x-4 pt-2">
              <a href="/" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"><FaFacebook size={20} /></a>
              <a href="/" className="text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"><FaTwitter size={20} /></a>
              <a href="/" className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-colors"><FaInstagram size={20} /></a>
              <a href="/" className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"><FaYoutube size={20} /></a>
            </div>
          </div>

          {/* KOLOM 2: QUICK LINKS */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-6 text-lg transition-colors">{t('footer.quick_links')}</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">
                  Home
                </Link>
              </li>
              <li>
                <a href="#popular" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">
                  {t('home.popular')}
                </a>
              </li>
              <li>
                <a href="#top_rated" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">
                  {t('home.top_rated')}
                </a>
              </li>
              <li>
                <a href="#now_playing" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">
                  {t('home.now_playing')}
                </a>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: CATEGORIES */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-6 text-lg transition-colors">{t('footer.categories')}</h3>
            <ul className="space-y-4 text-sm">
              <li><span className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Action</span></li>
              <li><span className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Comedy</span></li>
              <li><span className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Drama</span></li>
              <li><span className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Horror</span></li>
            </ul>
          </div>

          {/* KOLOM 4: SUPPORT */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold mb-6 text-lg transition-colors">{t('footer.support')}</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">{t('footer.help_center')}</a></li>
              <li><a href="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">{t('footer.terms')}</a></li>
              <li><a href="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">{t('footer.privacy')}</a></li>
              <li><a href="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline">{t('footer.contact')}</a></li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR: COPYRIGHT */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center transition-colors">
          <p className="text-gray-400 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Kelvin Erlangga Satriagung. {t('footer.rights')}
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
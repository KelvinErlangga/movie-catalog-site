import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      navbar: {
        genre: "Genre",
        year: "Year",
        country: "Country",
        now_playing: "Now Playing",
        popular: "Popular",
        top_rated: "Top Rated",
        search_placeholder: "Search movies...",
        clear_filters: "Clear All Filters",
        clear: "Clear",
        genre_search: "Search genre...",
        year_search: "Search year...",
        country_search: "Search country...",
        not_found: "not found"
      },
      home: {
        search_results: "Search Results",
        items: "items",
        sort_by: "Sort By",
        order: "Order",
        newest: "Newest First",
        oldest: "Oldest First",
        high_low: "High to Low",
        low_high: "Low to High",
        clear_search: "Clear Search",
        clear_filters: "Clear Filters",
        fetching: "Fetching movies from database...",
        no_movies: "No movies found.",
        reset: "Reset Filters",
        loading: "Loading movies...",
        now_playing: "Now Playing",
        popular: "Popular Movies",
        top_rated: "Top Rated",
        movies_from: "Movies from"
      },
      footer: {
        description: "The best movie streaming platform with the most complete collection from various countries. Enjoy unlimited viewing experience with the best quality.",
        quick_links: "Quick Links",
        categories: "Categories",
        support: "Support",
        help_center: "Help Center",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        contact: "Contact Us",
        rights: "All rights reserved."
      }
    }
  },
  id: {
    translation: {
      navbar: {
        genre: "Genre",
        year: "Tahun",
        country: "Negara",
        now_playing: "Sedang Tayang",
        popular: "Populer",
        top_rated: "Rating Tertinggi",
        search_placeholder: "Cari film...",
        clear_filters: "Hapus Semua Filter",
        clear: "Hapus",
        genre_search: "Cari genre...",
        year_search: "Cari tahun...",
        country_search: "Cari negara...",
        not_found: "tidak ditemukan"
      },
      home: {
        search_results: "Hasil Pencarian",
        items: "judul",
        sort_by: "Urutkan:",
        order: "Urutan:",
        newest: "Terbaru",
        oldest: "Terlama",
        high_low: "Tinggi ke Rendah",
        low_high: "Rendah ke Tinggi",
        clear_search: "Hapus Pencarian",
        clear_filters: "Hapus Filter",
        fetching: "Mengambil data film...",
        no_movies: "Film tidak ditemukan.",
        reset: "Reset Filter",
        loading: "Memuat film...",
        now_playing: "Sedang Tayang",
        popular: "Film Populer",
        top_rated: "Rating Tertinggi",
        movies_from: "Film dari"
      },
      footer: {
        description: "Platform streaming film terbaik dengan koleksi terlengkap dari berbagai negara. Nikmati pengalaman menonton tanpa batas dengan kualitas terbaik.",
        quick_links: "Tautan Cepat",
        categories: "Kategori",
        support: "Dukungan",
        help_center: "Pusat Bantuan",
        terms: "Syarat & Ketentuan",
        privacy: "Kebijakan Privasi",
        contact: "Hubungi Kami",
        rights: "Hak cipta dilindungi."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
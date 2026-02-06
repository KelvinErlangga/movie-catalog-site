import React, { useState, useEffect, useRef } from "react";
import { getMovieGenres, getCountries } from "../services/api";
import { useTheme } from "../context/ThemeContext";
import { IoMdMoon, IoMdSunny } from "react-icons/io";

export default function NavBar({ onSearch, onGenreFilter, onYearFilter, onCountryFilter, onReset, activeGenre, activeYear, activeCountry }) {
  const { theme, toggleTheme } = useTheme();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  
  const [countries, setCountries] = useState([]);
  const [genres, setGenres] = useState([]);
  
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const dropdownRef = useRef(null);

  // --- PERBAIKAN LOGIC TAHUN ---
  // Kita ambil tahun sekarang secara otomatis (2026)
  const currentYear = new Date().getFullYear();
  // Kita buat array mundur 50 tahun ke belakang, DIMULAI DARI currentYear + 1 (2027)
  // Jadi listnya: 2027, 2026, 2025, 2024, ... dst
  const years = Array.from({ length: 50 }, (_, i) => currentYear + 1 - i);

  // --- LOGIC CLICK OUTSIDE ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsGenreDropdownOpen(false);
        setIsYearDropdownOpen(false);
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedGenre(activeGenre);
    setSelectedYear(activeYear);
    setSelectedCountry(activeCountry);
  }, [activeGenre, activeYear, activeCountry]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [genreList, countryList] = await Promise.all([
          getMovieGenres(),
          Promise.resolve(getCountries())
        ]);
        setGenres(genreList);
        setCountries(countryList);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    setSelectedGenre(null);
    setSelectedYear(null);
    setSelectedCountry(null);
    if (onReset) {
        onReset();
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        window.location.href = "/";
    }
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setIsGenreDropdownOpen(false);
    onGenreFilter(genre);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setIsYearDropdownOpen(false);
    onYearFilter(year);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
    onCountryFilter(country);
  };

  const clearFiltersAndNotify = () => {
    if (onReset) onReset(); 
    setIsGenreDropdownOpen(false);
    setIsYearDropdownOpen(false);
    setIsCountryDropdownOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-lg' 
        : 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-transparent dark:border-gray-800/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          
          <div className="flex-shrink-0">
            <button 
                onClick={handleLogoClick} 
                className="group relative no-underline bg-transparent border-none cursor-pointer text-left p-0"
            >
              <span className="relative text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                CINEMA
                <span className="ml-1 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">VIN</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3" ref={dropdownRef}>
            
            {/* Genre Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                   setIsGenreDropdownOpen(!isGenreDropdownOpen);
                   setIsYearDropdownOpen(false);
                   setIsCountryDropdownOpen(false);
                }}
                className={`relative font-medium text-base transition-all duration-300 no-underline group px-3 py-2 rounded-lg border 
                  ${isGenreDropdownOpen 
                    ? 'text-gray-900 bg-white border-gray-200 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white border-transparent'
                  }`}
              >
                <span className="flex items-center">
                  Genre
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`ml-1 h-4 w-4 transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
                {selectedGenre && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                )}
              </button>
              
              {isGenreDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl animate-in slide-in-from-top-2 duration-200 overflow-hidden z-50">
                  <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300">
                    <div className="sticky top-0 bg-white pb-2 mb-2 border-b border-gray-100 z-10">
                      <button
                        onClick={clearFiltersAndNotify}
                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors w-full text-left px-2 py-1 uppercase tracking-wider"
                      >
                        Clear All Filters
                      </button>
                    </div>
                    {genres.map((genre) => (
                      <button
                        key={genre.id}
                        onClick={() => handleGenreSelect(genre)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 text-sm mb-1
                          ${selectedGenre?.id === genre.id 
                            ? 'bg-blue-50 text-blue-700 font-bold' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                          }`}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Year Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                   setIsYearDropdownOpen(!isYearDropdownOpen);
                   setIsGenreDropdownOpen(false);
                   setIsCountryDropdownOpen(false);
                }}
                className={`relative font-medium text-base transition-all duration-300 no-underline group px-3 py-2 rounded-lg border
                  ${isYearDropdownOpen 
                    ? 'text-gray-900 bg-white border-gray-200 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white border-transparent'
                  }`}
              >
                <span className="flex items-center">
                  Year
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`ml-1 h-4 w-4 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
                {selectedYear && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                  </span>
                )}
              </button>
              
              {isYearDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-32 bg-white border border-gray-200 rounded-xl shadow-2xl animate-in slide-in-from-top-2 duration-200 overflow-hidden z-50">
                  <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300">
                    <div className="sticky top-0 bg-white pb-2 mb-2 border-b border-gray-100 z-10">
                      <button
                        onClick={clearFiltersAndNotify}
                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors w-full text-left px-2 py-1 uppercase tracking-wider"
                      >
                        Clear
                      </button>
                    </div>
                    {/* LIST TAHUN YANG SUDAH DINAMIS */}
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm mb-1
                          ${selectedYear === year 
                            ? 'bg-purple-50 text-purple-700 font-bold' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                          }`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Country Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                   setIsCountryDropdownOpen(!isCountryDropdownOpen);
                   setIsGenreDropdownOpen(false);
                   setIsYearDropdownOpen(false);
                }}
                className={`relative font-medium text-base transition-all duration-300 no-underline group px-3 py-2 rounded-lg border
                  ${isCountryDropdownOpen 
                    ? 'text-gray-900 bg-white border-gray-200 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white border-transparent'
                  }`}
              >
                <span className="flex items-center">
                  Country
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`ml-1 h-4 w-4 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
                {selectedCountry && (
                   <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                )}
              </button>
              
              {isCountryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl animate-in slide-in-from-top-2 duration-200 overflow-hidden z-50">
                  <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300">
                    <div className="sticky top-0 bg-white pb-2 mb-2 border-b border-gray-100 z-10">
                      <button
                        onClick={clearFiltersAndNotify}
                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors w-full text-left px-2 py-1 uppercase tracking-wider"
                      >
                        Clear
                      </button>
                    </div>
                    {countries.map((country) => (
                      <button
                        key={country.iso_3166_1}
                        onClick={() => handleCountrySelect(country)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 text-sm mb-1 truncate
                          ${selectedCountry?.iso_3166_1 === country.iso_3166_1 
                            ? 'bg-emerald-50 text-emerald-700 font-bold' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                          }`}
                      >
                        {country.english_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Static Links */}
            {[
              { name: "Now Playing", href: "#now_playing" },
              { name: "Popular", href: "#popular" },
              { name: "Top Rated", href: "#top_rated" }
            ].map((item, index) => (
              <a 
                key={item.name}
                href={item.href} 
                className="relative text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white font-medium text-xs transition-all duration-300 hover:scale-105 no-underline px-3 py-2"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Search & Theme Toggle */}
          <div className="hidden md:flex items-center space-x-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className={`flex items-center transition-all duration-500 transform ${
                isSearchFocused ? 'scale-105' : ''
              }`}>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search movies..."
                    className={`relative w-48 lg:w-64 px-4 py-2 pr-10 rounded-full text-sm transition-all duration-300
                      bg-white text-gray-900 placeholder-gray-500 border
                      ${isSearchFocused 
                        ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/20' 
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>

            <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-transparent dark:border-gray-700"
                aria-label="Toggle Theme"
            >
                {theme === 'dark' ? <IoMdSunny className="w-5 h-5 text-yellow-500" /> : <IoMdMoon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-yellow-500 dark:text-blue-300 border border-transparent dark:border-gray-700"
            >
                {theme === 'dark' ? <IoMdSunny className="w-5 h-5" /> : <IoMdMoon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 py-4 space-y-4 animate-in slide-in-from-top duration-300 bg-white dark:bg-black">
             <div className="px-2 space-y-2">
                <button onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)} className="w-full text-left px-4 py-2 text-gray-900 dark:text-white font-medium bg-gray-100 dark:bg-gray-900 rounded-lg">Browse Genre</button>
                {isGenreDropdownOpen && (
                    <div className="pl-4 pr-2 grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {genres.map(g => (
                            <button key={g.id} onClick={() => { handleGenreSelect(g); setIsMenuOpen(false); }} className="text-left text-sm text-gray-600 dark:text-gray-400 py-1 hover:text-blue-500">{g.name}</button>
                        ))}
                    </div>
                )}
             </div>
             
             <div className="px-2 grid grid-cols-3 gap-2">
                <a href="#now_playing" className="text-center px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Now Playing</a>
                <a href="#popular" className="text-center px-3 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Popular</a>
                <a href="#top_rated" className="text-center px-3 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg text-sm font-medium" onClick={() => setIsMenuOpen(false)}>Top Rated</a>
             </div>
          </div>
        )}
      </div>
    </nav>
  );
}
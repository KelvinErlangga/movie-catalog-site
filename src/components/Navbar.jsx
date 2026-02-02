import React, { useState, useEffect } from "react";
import { getMovieGenres, getCountries } from "../services/api";

export default function NavBar({ onSearch, onGenreFilter, onYearFilter, onCountryFilter }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  // Generate years from 2024 back to 1970
  const years = Array.from({ length: 55 }, (_, i) => 2024 - i);

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

  const clearFilters = () => {
    setSelectedGenre(null);
    setSelectedYear(null);
    setSelectedCountry(null);
    onGenreFilter(null);
    onYearFilter(null);
    onCountryFilter(null);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl shadow-black/20' 
        : 'bg-gray-900/80 backdrop-blur-md border-b border-gray-800/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-500 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo with enhanced styling */}
          <div className="flex-shrink-0">
            <a href="/" className="group relative no-underline">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
              <span className="relative text-2xl font-extrabold text-white tracking-tight transition-all duration-500 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text">
                CINEMA
                <span className="ml-1 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent transition-all duration-500">VIN</span>
              </span>
            </a>
          </div>

          {/* Enhanced Desktop Navigation with Filters */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Genre Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                className="relative text-gray-300 hover:text-white font-medium text-base transition-all duration-300 hover:scale-105 no-underline group px-3 py-2 rounded-lg hover:bg-gray-800/50"
              >
                <span className="flex items-center">
                  Genre
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ml-1 h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
                {selectedGenre && (
                  <span className="ml-2 text-xs px-2 py-1 bg-blue-600/30 text-blue-300 rounded-full">
                    {selectedGenre.name}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </button>
              
              {isGenreDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl animate-in slide-in-from-top duration-200">
                  <div className="max-h-80 overflow-y-auto p-2">
                    <div className="sticky top-0 bg-gray-800/95 backdrop-blur-xl pb-2 mb-2 border-b border-gray-700/50">
                      <button
                        onClick={clearFilters}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                    {genres.map((genre) => (
                      <button
                        key={genre.id}
                        onClick={() => handleGenreSelect(genre)}
                        className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 no-underline text-sm"
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
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="relative text-gray-300 hover:text-white font-medium text-base transition-all duration-300 hover:scale-105 no-underline group px-3 py-2 rounded-lg hover:bg-gray-800/50"
              >
                <span className="flex items-center">
                  Year
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ml-1 h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
                {selectedYear && (
                  <span className="ml-2 text-xs px-2 py-1 bg-purple-600/30 text-purple-300 rounded-full">
                    {selectedYear}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </button>
              
              {isYearDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-32 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl animate-in slide-in-from-top duration-200">
                  <div className="max-h-80 overflow-y-auto p-2">
                    <div className="sticky top-0 bg-gray-800/95 backdrop-blur-xl pb-2 mb-2 border-b border-gray-700/50">
                      <button
                        onClick={clearFilters}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 no-underline text-sm"
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
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                className="relative text-gray-300 hover:text-white font-medium text-base transition-all duration-300 hover:scale-105 no-underline group px-3 py-2 rounded-lg hover:bg-gray-800/50"
              >
                <span className="flex items-center">
                  Country
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ml-1 h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
                {selectedCountry && (
                  <span className="ml-2 text-xs px-2 py-1 bg-green-600/30 text-green-300 rounded-full">
                    {selectedCountry.english_name}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </button>
              
              {isCountryDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-2xl animate-in slide-in-from-top duration-200">
                  <div className="max-h-80 overflow-y-auto p-2">
                    <div className="sticky top-0 bg-gray-800/95 backdrop-blur-xl pb-2 mb-2 border-b border-gray-700/50">
                      <button
                        onClick={clearFilters}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    {countries.map((country) => (
                      <button
                        key={country.iso_3166_1}
                        onClick={() => handleCountrySelect(country)}
                        className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 no-underline text-sm"
                      >
                        {country.english_name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Original Navigation Links */}
            {[
              { name: "Now Playing", href: "#now_playing" },
              { name: "Popular", href: "#popular" },
              { name: "Top Rated", href: "#top_rated" }
            ].map((item, index) => (
              <a 
                key={item.name}
                href={item.href} 
                className="relative text-gray-300 hover:text-white font-medium text-xs transition-all duration-300 hover:scale-105 no-underline group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </a>
            ))}
          </div>

          {/* Enhanced Search Bar */}
          <div className="hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className={`flex items-center transition-all duration-500 transform ${
                isSearchFocused ? 'scale-105' : ''
              }`}>
                <div className="relative flex items-center">
                  <div className={`absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-xl transition-all duration-500 ${
                    isSearchFocused ? 'opacity-100 blur-sm' : 'opacity-0'
                  }`}></div>
                  <input
                    type="text"
                    placeholder="Discover movies..."
                    className={`relative w-64 px-4 py-2 pr-10 bg-gray-800/60 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-500 text-sm font-light backdrop-blur-sm ${
                      isSearchFocused 
                        ? 'border-blue-500/50 bg-gray-800/80 shadow-xl shadow-blue-500/20' 
                        : 'border-gray-700/50 hover:border-gray-600'
                    }`}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  <button
                    type="submit"
                    className={`absolute right-2 p-2 rounded-lg transition-all duration-500 transform ${
                      isSearchFocused
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110' 
                        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600 hover:text-white hover:scale-105'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="relative text-gray-400 hover:text-white p-3 rounded-xl hover:bg-gray-800/50 transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="relative h-6 w-6">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-800/50 backdrop-blur-xl animate-in slide-in-from-top duration-300">
            <div className="px-4 py-6 space-y-3">
              {/* Mobile Genre Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                  className="w-full text-left text-gray-300 hover:text-white font-medium text-base py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300 no-underline group"
                >
                  <span className="flex items-center justify-between">
                    Genre
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                
                {isGenreDropdownOpen && (
                  <div className="mt-2 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-2 max-h-60 overflow-y-auto">
                    {genres.map((genre) => (
                      <button
                        key={genre.id}
                        onClick={() => handleGenreSelect(genre)}
                        className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 no-underline text-sm"
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Year Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                  className="w-full text-left text-gray-300 hover:text-white font-medium text-base py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300 no-underline group"
                >
                  <span className="flex items-center justify-between">
                    Year
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                
                {isYearDropdownOpen && (
                  <div className="mt-2 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-2 max-h-60 overflow-y-auto">
                    {years.map((year) => (
                      <button
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 no-underline text-sm"
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Country Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="w-full text-left text-gray-300 hover:text-white font-medium text-base py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300 no-underline group"
                >
                  <span className="flex items-center justify-between">
                    Country
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                
                {isCountryDropdownOpen && (
                  <div className="mt-2 bg-gray-800/95 backdrop-blur-xl border border-gray-700/50 rounded-xl p-2 max-h-60 overflow-y-auto">
                    {countries.map((country) => (
                      <button
                        key={country.iso_3166_1}
                        onClick={() => handleCountrySelect(country)}
                        className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 no-underline text-sm"
                      >
                        {country.english_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Original Navigation Links */}
              {[
                { name: "Now Playing", href: "#now_playing" },
                { name: "Popular", href: "#popular" },
                { name: "Top Rated", href: "#top_rated" }
              ].map((item, index) => (
                <a 
                  key={item.name}
                  href={item.href} 
                  className="block text-gray-300 hover:text-white font-medium text-base py-2 px-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300 no-underline group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                </a>
              ))}
              
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="pt-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl blur-sm"></div>
                  <input
                    type="text"
                    placeholder="Discover movies..."
                    className="relative w-full px-4 py-2.5 pr-10 bg-gray-800/60 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-gray-800/80 transition-all duration-300 text-sm font-light backdrop-blur-sm"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

import React, { useState, useEffect } from "react";

export default function NavBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
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

          {/* Enhanced Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-8">
              {[
                { name: "Now Playing", href: "#now_playing" },
                { name: "Popular", href: "#popular" },
                { name: "Top Rated", href: "#top_rated" }
              ].map((item, index) => (
                <a 
                  key={item.name}
                  href={item.href} 
                  className="relative text-gray-300 hover:text-white font-medium text-base transition-all duration-300 hover:scale-105 no-underline group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                </a>
              ))}
            </div>
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
                    className={`relative w-80 px-5 py-2.5 pr-12 bg-gray-800/60 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-500 text-sm font-light backdrop-blur-sm ${
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

import { useEffect, useState, useRef } from "react";
import { getMovieList, nowPlayingMovie, topRatedMovie, searchMovie, getMoviesByGenre, getMoviesByYear, getMoviesByGenreAndYear, getMoviesByCountry, getMoviesByMultipleFilters } from "../services/api";
import NavBar from "../components/Navbar";
import MovieCarousel from "../components/Carousel";
import MovieList from "../components/MovieList";
import { IoIosArrowUp } from "react-icons/io";

const Home = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [activeGenre, setActiveGenre] = useState(null);
  const [activeYear, setActiveYear] = useState(null);
  const [activeCountry, setActiveCountry] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'search', 'filter'
  const baseImgUrl = process.env.REACT_APP_BASEIMGURL;
  const nowPlayingRef = useRef(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const [nowPlaying, popular, topRated] = await Promise.all([
          nowPlayingMovie(),
          getMovieList(),
          topRatedMovie()
        ]);
        
        setNowPlayingMovies(nowPlaying);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setLoading(false);
      } catch (error) {
        console.error("Error loading movies:", error);
        setLoading(false);
      }
    };

    loadMovies();

    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const search = async (q) => {
    if (q.length > 1) {
      try {
        const query = await searchMovie(q);
        setSearchResults(query.results);
        setCurrentView('search');
        setActiveGenre(null);
        setActiveYear(null);
        setActiveCountry(null);
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      setSearchResults([]);
      setCurrentView('home');
    }
  };

  const handleGenreFilter = async (genre) => {
    setFilterLoading(true);
    setActiveGenre(genre);
    setCurrentView('filter');
    
    try {
      let results;
      if (genre && activeYear && activeCountry) {
        results = await getMoviesByMultipleFilters(genre.id, activeYear, activeCountry.iso_3166_1);
      } else if (genre && activeYear) {
        results = await getMoviesByGenreAndYear(genre.id, activeYear);
      } else if (genre && activeCountry) {
        results = await getMoviesByMultipleFilters(genre.id, null, activeCountry.iso_3166_1);
      } else if (genre) {
        results = await getMoviesByGenre(genre.id);
      } else {
        setCurrentView('home');
        results = [];
      }
      setFilteredMovies(results);
    } catch (error) {
      console.error("Error filtering by genre:", error);
      setFilteredMovies([]);
    } finally {
      setFilterLoading(false);
    }
  };

  const handleYearFilter = async (year) => {
    setFilterLoading(true);
    setActiveYear(year);
    setCurrentView('filter');
    
    try {
      let results;
      if (year && activeGenre && activeCountry) {
        results = await getMoviesByMultipleFilters(activeGenre.id, year, activeCountry.iso_3166_1);
      } else if (year && activeGenre) {
        results = await getMoviesByGenreAndYear(activeGenre.id, year);
      } else if (year && activeCountry) {
        results = await getMoviesByMultipleFilters(null, year, activeCountry.iso_3166_1);
      } else if (year) {
        results = await getMoviesByYear(year);
      } else {
        setCurrentView('home');
        results = [];
      }
      setFilteredMovies(results);
    } catch (error) {
      console.error("Error filtering by year:", error);
      setFilteredMovies([]);
    } finally {
      setFilterLoading(false);
    }
  };

  const handleCountryFilter = async (country) => {
    setFilterLoading(true);
    setActiveCountry(country);
    setCurrentView('filter');
    
    try {
      let results;
      if (country && activeGenre && activeYear) {
        results = await getMoviesByMultipleFilters(activeGenre.id, activeYear, country.iso_3166_1);
      } else if (country && activeGenre) {
        results = await getMoviesByMultipleFilters(activeGenre.id, null, country.iso_3166_1);
      } else if (country && activeYear) {
        results = await getMoviesByMultipleFilters(null, activeYear, country.iso_3166_1);
      } else if (country) {
        results = await getMoviesByCountry(country.iso_3166_1);
      } else {
        setCurrentView('home');
        results = [];
      }
      setFilteredMovies(results);
    } catch (error) {
      console.error("Error filtering by country:", error);
      setFilteredMovies([]);
    } finally {
      setFilterLoading(false);
    }
  };

  const clearFilters = () => {
    setActiveGenre(null);
    setActiveYear(null);
    setActiveCountry(null);
    setFilteredMovies([]);
    setCurrentView('home');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getFilterTitle = () => {
    if (activeGenre && activeYear && activeCountry) {
      return `${activeGenre.name} Movies - ${activeYear} (${activeCountry.english_name})`;
    } else if (activeGenre && activeYear) {
      return `${activeGenre.name} Movies - ${activeYear}`;
    } else if (activeGenre && activeCountry) {
      return `${activeGenre.name} Movies (${activeCountry.english_name})`;
    } else if (activeYear && activeCountry) {
      return `Movies from ${activeYear} (${activeCountry.english_name})`;
    } else if (activeGenre) {
      return `${activeGenre.name} Movies`;
    } else if (activeYear) {
      return `Movies from ${activeYear}`;
    } else if (activeCountry) {
      return `Movies from ${activeCountry.english_name}`;
    }
    return "";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar 
        onSearch={search} 
        onGenreFilter={handleGenreFilter} 
        onYearFilter={handleYearFilter}
        onCountryFilter={handleCountryFilter}
      />
      
      <div className="relative">
        {currentView === 'search' && searchResults.length > 0 ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Search Results</h2>
              <button
                onClick={() => {
                  setSearchResults([]);
                  setCurrentView('home');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Clear Search
              </button>
            </div>
            <MovieList movies={searchResults} />
          </div>
        ) : currentView === 'filter' && (activeGenre || activeYear || activeCountry) ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{getFilterTitle()}</h2>
              <button
                onClick={clearFilters}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            </div>
            {filterLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Loading filtered movies...</p>
              </div>
            ) : filteredMovies.length > 0 ? (
              <MovieList movies={filteredMovies} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No movies found for this filter combination.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Hero Carousel */}
            <section ref={nowPlayingRef}>
              <MovieCarousel movies={nowPlayingMovies} baseImgUrl={baseImgUrl} />
            </section>

            {/* Content Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Now Playing Section */}
              <section className="py-12" id="now_playing">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold">Now Playing</h2>
                  <button
                    onClick={() => scrollToSection("now_playing")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {nowPlayingMovies.length > 0 ? (
                  <MovieList movies={nowPlayingMovies} />
                ) : (
                  <p className="text-gray-400 text-center py-8">No movies currently playing</p>
                )}
              </section>

              {/* Popular Movies Section */}
              <section className="py-12 border-t border-gray-800" id="popular">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold">Popular Movies</h2>
                  <button
                    onClick={() => scrollToSection("popular")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {popularMovies.length > 0 ? (
                  <MovieList movies={popularMovies} />
                ) : (
                  <p className="text-gray-400 text-center py-8">No popular movies available</p>
                )}
              </section>

              {/* Top Rated Section */}
              <section className="py-12 border-t border-gray-800" id="top_rated">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold">Top Rated</h2>
                  <button
                    onClick={() => scrollToSection("top_rated")}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                {topRatedMovies.length > 0 ? (
                  <MovieList movies={topRatedMovies} />
                ) : (
                  <p className="text-gray-400 text-center py-8">No top rated movies available</p>
                )}
              </section>
            </div>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-8 mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center text-gray-400">
                  <p>&copy; 2024 CINEMAVIN. All rights reserved.</p>
                  <p className="text-sm mt-2">Discover your next favorite movie</p>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
          aria-label="Scroll to top"
        >
          <IoIosArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default Home;

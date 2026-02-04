import { useEffect, useState, useRef } from "react";
import { getMovieList, nowPlayingMovie, topRatedMovie, searchMovie, getMoviesByGenre, getMoviesByYear, getMoviesByGenreAndYear, getMoviesByCountry, getMoviesByMultipleFilters } from "../services/api";
import NavBar from "../components/Navbar";
import MovieCarousel from "../components/Carousel";
import MovieList from "../components/MovieList";
import { IoIosArrowUp, IoMdArrowRoundUp, IoMdArrowRoundDown } from "react-icons/io";

const Home = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // --- Data States ---
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  
  // --- Filter & Search Logic States ---
  const [searchResults, setSearchResults] = useState(() => {
    const saved = sessionStorage.getItem('searchResults');
    return saved ? JSON.parse(saved) : [];
  });

  const [filteredMovies, setFilteredMovies] = useState(() => {
    const saved = sessionStorage.getItem('filteredMovies');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeGenre, setActiveGenre] = useState(() => {
    const saved = sessionStorage.getItem('activeGenre');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeYear, setActiveYear] = useState(() => {
    const saved = sessionStorage.getItem('activeYear');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeCountry, setActiveCountry] = useState(() => {
    const saved = sessionStorage.getItem('activeCountry');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentView, setCurrentView] = useState(() => {
    const saved = sessionStorage.getItem('currentView');
    return saved ? saved : 'home'; 
  });

  const [sortOrder, setSortOrder] = useState(() => {
    return sessionStorage.getItem('sortOrder') || 'desc';
  });

  // sortBy sekarang bisa 'rating', 'vote_count', atau 'release_date'
  const [sortBy, setSortBy] = useState(() => {
    return sessionStorage.getItem('sortBy') || 'rating';
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const saved = sessionStorage.getItem('currentPage');
    return saved ? parseInt(saved) : 1;
  });

  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  
  // PERUBAHAN: 30 ITEM PER PAGE
  const itemsPerPage = 30;
  
  const baseImgUrl = process.env.REACT_APP_BASEIMGURL;
  const nowPlayingRef = useRef(null);

  // --- EFFECT: AUTO-SAVE ---
  useEffect(() => {
    sessionStorage.setItem('searchResults', JSON.stringify(searchResults));
    sessionStorage.setItem('filteredMovies', JSON.stringify(filteredMovies));
    sessionStorage.setItem('activeGenre', JSON.stringify(activeGenre));
    sessionStorage.setItem('activeYear', JSON.stringify(activeYear));
    sessionStorage.setItem('activeCountry', JSON.stringify(activeCountry));
    sessionStorage.setItem('currentView', currentView);
    sessionStorage.setItem('sortOrder', sortOrder);
    sessionStorage.setItem('sortBy', sortBy);
    sessionStorage.setItem('currentPage', currentPage.toString());
  }, [searchResults, filteredMovies, activeGenre, activeYear, activeCountry, currentView, sortOrder, sortBy, currentPage]);

  useEffect(() => {
    const loadMovies = async () => {
      if (nowPlayingMovies.length > 0) return;

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- LOGIC FUNCTIONS ---

  const getActiveDataSource = () => {
    if (currentView === 'search') return searchResults;
    if (currentView === 'filter') return filteredMovies;
    return [];
  };

  // 2. Sort Data (UPDATED: Added Date Logic)
  const getSortedMovies = () => {
    const data = [...getActiveDataSource()];
    return data.sort((a, b) => {
      let valA, valB;

      // Tentukan nilai pembanding berdasarkan sortBy
      if (sortBy === 'rating') {
        valA = a.vote_average;
        valB = b.vote_average;
      } else if (sortBy === 'vote_count') {
        valA = a.vote_count;
        valB = b.vote_count;
      } else if (sortBy === 'release_date') {
        // Konversi string tanggal ke object Date agar bisa dibandingkan
        // Gunakan epoch 0 jika tanggal kosong agar tidak error
        valA = new Date(a.release_date || '1970-01-01');
        valB = new Date(b.release_date || '1970-01-01');
      }

      if (sortOrder === 'desc') {
        // High to Low (Newest to Oldest for Date)
        return valB - valA; 
      } else {
        // Low to High (Oldest to Newest for Date)
        return valA - valB; 
      }
    });
  };

  const getPaginatedMovies = () => {
    const sortedData = getSortedMovies();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return sortedData.slice(indexOfFirstItem, indexOfLastItem);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    setCurrentPage(1);
  };

  // Logic siklus tombol Sort: Rating -> Popularity -> Date -> Rating ...
  const cycleSortType = () => {
    setSortBy(prev => {
        if (prev === 'rating') return 'vote_count';
        if (prev === 'vote_count') return 'release_date';
        return 'rating';
    });
    setCurrentPage(1);
  };

  const resetPagination = () => {
    setCurrentPage(1);
    setSortOrder('desc');
    setSortBy('rating'); 
  };

  // --- HANDLERS ---

  const search = async (q) => {
    if (q.length > 1) {
      setFilterLoading(true);
      try {
        const results = await searchMovie(q); 
        setSearchResults(results);
        setCurrentView('search');
        setActiveGenre(null);
        setActiveYear(null);
        setActiveCountry(null);
        resetPagination();
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setFilterLoading(false);
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
    resetPagination();
    
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
    resetPagination();
    
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
    resetPagination();
    
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
    setSearchResults([]);
    setCurrentView('home');
    resetPagination();
    sessionStorage.clear(); 
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getFilterTitle = () => {
    let title = "Movies";
    if (activeCountry) title += ` from ${activeCountry.english_name}`;
    if (activeGenre) title = `${activeGenre.name} ${title}`;
    if (activeYear) title += ` (${activeYear})`;
    return title === "Movies" ? "" : title;
  };

  const Pagination = ({ totalItems }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center space-x-2 mt-8 py-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          Prev
        </button>
        <span className="text-gray-300 font-medium px-4">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          Next
        </button>
      </div>
    );
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

  // Helper untuk menampilkan Label Tombol Sort
  const getSortLabel = () => {
    if (sortBy === 'rating') return '⭐ Rating';
    if (sortBy === 'vote_count') return '👥 Popularity';
    if (sortBy === 'release_date') return '📅 Date';
    return '';
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar 
        onSearch={search} 
        onGenreFilter={handleGenreFilter} 
        onYearFilter={handleYearFilter}
        onCountryFilter={handleCountryFilter}
        onReset={clearFilters}
        activeGenre={activeGenre}
        activeYear={activeYear}
        activeCountry={activeCountry}
      />
      
      <div className="relative">
        {(currentView === 'search' || (currentView === 'filter' && (activeGenre || activeYear || activeCountry))) ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h2 className="text-2xl font-bold">
                {currentView === 'search' ? 'Search Results' : getFilterTitle()}
                <span className="text-sm font-normal text-gray-400 ml-2">({getActiveDataSource().length} items)</span>
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                {/* TOMBOL SORT TYPE (Updated: Rating -> Pop -> Date) */}
                <button
                  onClick={cycleSortType}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm border border-gray-700"
                >
                  <span className="text-gray-400">Sort By:</span>
                  <span className="font-bold text-white">{getSortLabel()}</span>
                </button>

                {/* TOMBOL ORDER (High/Low) */}
                <button
                  onClick={toggleSortOrder}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm border border-gray-700"
                >
                  <span className="text-gray-400">Order:</span>
                  <span className={`font-bold ${sortOrder === 'desc' ? 'text-green-400' : 'text-orange-400'}`}>
                    {/* Logic text order menyesuaikan tipe sort */}
                    {sortBy === 'release_date' 
                        ? (sortOrder === 'desc' ? 'Newest First' : 'Oldest First')
                        : (sortOrder === 'desc' ? 'High to Low' : 'Low to High')
                    }
                  </span>
                  {sortOrder === 'desc' ? <IoMdArrowRoundDown /> : <IoMdArrowRoundUp />}
                </button>

                <button
                  onClick={currentView === 'search' ? () => { setSearchResults([]); setCurrentView('home'); } : clearFilters}
                  className="text-gray-400 hover:text-white transition-colors text-sm underline ml-2"
                >
                  {currentView === 'search' ? 'Clear Search' : 'Clear Filters'}
                </button>
              </div>
            </div>

            {filterLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                {/* Update loading message agar user tau ini 500 data */}
                <p>Fetching 500 movies from database (This may take a few seconds)...</p>
              </div>
            ) : getActiveDataSource().length > 0 ? (
              <>
                {/* UPDATE 1: Kirim type 'search' atau 'filter' */}
                <MovieList movies={getPaginatedMovies()} type={currentView} />
                <Pagination totalItems={getActiveDataSource().length} />
              </>
            ) : (
              <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-gray-800">
                <p className="text-gray-400 text-lg">No movies found.</p>
                <button onClick={clearFilters} className="mt-4 text-blue-400 hover:underline">Reset Filters</button>
              </div>
            )}
          </div>
        ) : (
          <>
            <section ref={nowPlayingRef}>
              <MovieCarousel movies={nowPlayingMovies} baseImgUrl={baseImgUrl} />
            </section>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <section className="py-12" id="now_playing">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold">Now Playing</h2>
                  <button onClick={() => scrollToSection("now_playing")} className="text-gray-400 hover:text-white">
                    <IoIosArrowUp />
                  </button>
                </div>
                {/* UPDATE 2: Kirim type 'now_playing' */}
                <MovieList movies={nowPlayingMovies} type="now_playing" />
              </section>
              <section className="py-12 border-t border-gray-800" id="popular">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold">Popular Movies</h2>
                  <button onClick={() => scrollToSection("popular")} className="text-gray-400 hover:text-white">
                    <IoIosArrowUp />
                  </button>
                </div>
                {/* UPDATE 3: Kirim type 'popular' */}
                <MovieList movies={popularMovies} type="popular" />
              </section>
              <section className="py-12 border-t border-gray-800" id="top_rated">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold">Top Rated</h2>
                  <button onClick={() => scrollToSection("top_rated")} className="text-gray-400 hover:text-white">
                      <IoIosArrowUp />
                  </button>
                </div>
                {/* UPDATE 4: Kirim type 'top_rated' */}
                <MovieList movies={topRatedMovies} type="top_rated" />
              </section>
            </div>
            <footer className="border-t border-gray-800 py-8 mt-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center text-gray-400">
                  <p>&copy; 2026 CINEMAVIN. All rights reserved.</p>
                  <p className="text-sm mt-2">Discover your next favorite movie</p>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
      {showScrollToTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg z-40">
          <IoIosArrowUp size={20} />
        </button>
      )}
    </div>
  );
};

export default Home;
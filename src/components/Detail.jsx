import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getMovieDetails, searchMovie } from "../services/api";
import NavBar from "./Navbar";
import MovieList from "../components/MovieList";

const Detail = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [movieDetail, setMovieDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const baseImgUrl = process.env.REACT_APP_BASEIMGURL;
  const backdropUrl = "https://image.tmdb.org/t/p/original";

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    setMovieDetail(null);
    
    getMovieDetails(id)
      .then((result) => {
        setMovieDetail(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    
    window.scrollTo(0, 0);
  }, [id]);

  const search = async (q) => {
    if (q.length > 1) {
      const query = await searchMovie(q);
      setSearchResults(query.results);
    }
  };

  // --- LOGIC PERBAIKAN NAVIGASI DARI DETAIL KE HOME FILTER ---
  // Saat user klik filter di halaman detail, simpan datanya lalu lempar ke home
  
  const handleGenreRedirect = (genre) => {
    // 1. Simpan filter yang dipilih user
    sessionStorage.setItem('activeGenre', JSON.stringify(genre));
    sessionStorage.setItem('currentView', 'filter');
    
    // 2. Reset filter lain biar gak tabrakan
    sessionStorage.removeItem('activeYear');
    sessionStorage.removeItem('activeCountry');
    sessionStorage.removeItem('searchResults');
    
    // 3. Pindah ke Home (Home akan baca sessionStorage dan auto-fetch)
    navigate('/');
  };

  const handleYearRedirect = (year) => {
    sessionStorage.setItem('activeYear', JSON.stringify(year));
    sessionStorage.setItem('currentView', 'filter');
    
    sessionStorage.removeItem('activeGenre');
    sessionStorage.removeItem('activeCountry');
    sessionStorage.removeItem('searchResults');
    
    navigate('/');
  };

  const handleCountryRedirect = (country) => {
    sessionStorage.setItem('activeCountry', JSON.stringify(country));
    sessionStorage.setItem('currentView', 'filter');
    
    sessionStorage.removeItem('activeGenre');
    sessionStorage.removeItem('activeYear');
    sessionStorage.removeItem('searchResults');
    
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movieDetail) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Movie not found</p>
        <button 
            onClick={() => navigate('/')}
            className="ml-4 text-blue-500 hover:underline"
        >
            Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* UPDATE PROPS NAVBAR DENGAN HANDLER BARU */}
      <NavBar 
        onSearch={search}
        onGenreFilter={handleGenreRedirect}
        onYearFilter={handleYearRedirect}
        onCountryFilter={handleCountryRedirect}
      />
      
      <div className="flex-grow">
        {searchResults.length > 0 ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Search Results</h2>
                <button 
                    onClick={() => setSearchResults([])}
                    className="text-gray-400 hover:text-white"
                >
                    Clear Search
                </button>
            </div>
            <MovieList movies={searchResults} />
          </div>
        ) : (
          <div className="relative">
            {/* HERO SECTION */}
            <div className="relative h-96 md:h-[600px] overflow-hidden">
              <img
                src={movieDetail.backdrop_path 
                  ? `${backdropUrl}${movieDetail.backdrop_path}` 
                  : "/no_image_available.jpg"
                }
                alt={movieDetail.title}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative -mt-32 md:-mt-64 z-10 pb-12">
                <div className="flex flex-col md:flex-row gap-8">
                  
                  {/* Poster */}
                  <div className="flex-shrink-0">
                    <img
                      src={movieDetail.poster_path 
                        ? `${baseImgUrl}${movieDetail.poster_path}` 
                        : "/no_image_available.jpg"
                      }
                      alt={movieDetail.title}
                      className="w-48 md:w-80 rounded-xl shadow-2xl mx-auto md:mx-0 border-4 border-gray-800/50"
                    />
                  </div>

                  {/* Info Text */}
                  <div className="flex-1 text-center md:text-left pt-4 md:pt-12">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-white drop-shadow-lg">
                      {movieDetail.original_title || movieDetail.title}
                    </h1>
                    
                    {movieDetail.tagline && (
                      <p className="text-gray-300 text-lg mb-4 italic font-light">
                        "{movieDetail.tagline}"
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
                      <div className="flex items-center bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700 backdrop-blur-md">
                        <span className="text-yellow-400 mr-2 text-lg">★</span>
                        <span className="font-bold text-white text-lg">{movieDetail.vote_average?.toFixed(1) || 'N/A'}</span>
                        <span className="text-gray-400 ml-1 text-sm">({movieDetail.vote_count || 0})</span>
                      </div>
                      
                      {movieDetail.runtime && (
                        <span className="text-gray-200 bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700 backdrop-blur-md font-medium">
                          {Math.floor(movieDetail.runtime / 60)}h {movieDetail.runtime % 60}m
                        </span>
                      )}
                      
                      {movieDetail.release_date && (
                        <span className="text-gray-200 bg-gray-800/60 px-3 py-1.5 rounded-lg border border-gray-700 backdrop-blur-md font-medium">
                          {new Date(movieDetail.release_date).getFullYear()}
                        </span>
                      )}
                    </div>

                    {movieDetail.genres && movieDetail.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
                        {movieDetail.genres.map((genre) => (
                          <span
                            key={genre.id}
                            className="px-4 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 rounded-full text-sm border border-blue-500/20 transition-colors"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mb-8 max-w-4xl">
                      <h2 className="text-xl font-bold mb-3 text-white border-l-4 border-blue-600 pl-4">Overview</h2>
                      <p className="text-gray-300 leading-relaxed text-lg text-justify md:text-left">
                        {movieDetail.overview || "No synopsis available."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-12">
                      {movieDetail.homepage && (
                        <a
                          href={movieDetail.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:-translate-y-1 shadow-lg shadow-blue-900/30 no-underline"
                        >
                          Official Website
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ml-2 h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      
                      {movieDetail.imdb_id && (
                        <a
                          href={`https://www.imdb.com/title/${movieDetail.imdb_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-6 py-3 bg-[#F5C518] hover:bg-[#E2B616] text-black font-bold rounded-xl transition-all hover:-translate-y-1 shadow-lg no-underline"
                        >
                          IMDb
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ml-2 h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {movieDetail.production_companies && movieDetail.production_companies.length > 0 && (
                  <div className="mt-20">
                    <div className="flex items-center mb-6">
                      <h2 className="text-xl font-bold text-white mr-4">Production Companies</h2>
                      <div className="h-px bg-gray-800 flex-grow"></div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                      <div className="flex flex-wrap justify-center md:justify-start gap-12 items-center">
                        {movieDetail.production_companies
                          .filter(company => company.logo_path)
                          .map((company) => (
                            <div key={company.id} className="group relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 hover:bg-white/5">
                              <img
                                src={`https://image.tmdb.org/t/p/original${company.logo_path}`}
                                alt={company.name}
                                className="h-10 md:h-16 w-auto object-contain filter brightness-0 invert opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                              />
                              <span className="absolute -bottom-2 opacity-0 group-hover:opacity-100 text-xs text-gray-400 transition-opacity duration-300 mt-2 whitespace-nowrap">
                                {company.name}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-gray-800 bg-black py-8 mt-auto z-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400">
            <p className="font-medium">&copy; 2026 CINEMAVIN. All rights reserved.</p>
            <p className="text-sm mt-2 text-gray-600">Discover your next favorite movie</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Detail;
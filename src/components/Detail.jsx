import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getMovieDetails, searchMovie } from "../services/api";
import NavBar from "./Navbar";
import MovieList from "../components/MovieList";

const Detail = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [movieDetail, setMovieDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseImgUrl = process.env.REACT_APP_BASEIMGURL;

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    getMovieDetails(id)
      .then((result) => {
        setMovieDetail(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const search = async (q) => {
    if (q.length > 1) {
      const query = await searchMovie(q);
      setSearchResults(query.results);
    }
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavBar onSearch={search} />
      
      {searchResults.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold mb-6">Search Results</h2>
          <MovieList movies={searchResults} />
        </div>
      ) : (
        <div className="relative">
          {/* Hero Background */}
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            <img
              src={`${baseImgUrl}${movieDetail.backdrop_path || "/no_image_available.jpg"}`}
              alt={movieDetail.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>

          {/* Movie Details Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative -mt-32 md:-mt-48">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Movie Poster */}
                <div className="flex-shrink-0">
                  <img
                    src={`${baseImgUrl}${movieDetail.poster_path || "/no_image_available.jpg"}`}
                    alt={movieDetail.title}
                    className="w-48 md:w-72 rounded-lg shadow-2xl mx-auto md:mx-0"
                  />
                </div>

                {/* Movie Information */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-5xl font-bold mb-2">
                    {movieDetail.original_title || movieDetail.title}
                  </h1>
                  
                  {movieDetail.tagline && (
                    <p className="text-gray-400 text-lg mb-4 italic">
                      "{movieDetail.tagline}"
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-semibold">{movieDetail.vote_average?.toFixed(1) || 'N/A'}</span>
                      <span className="text-gray-400 ml-1">({movieDetail.vote_count || 0} votes)</span>
                    </div>
                    
                    {movieDetail.runtime && (
                      <span className="text-gray-300">
                        {Math.floor(movieDetail.runtime / 60)}h {movieDetail.runtime % 60}m
                      </span>
                    )}
                    
                    {movieDetail.release_date && (
                      <span className="text-gray-300">
                        {new Date(movieDetail.release_date).getFullYear()}
                      </span>
                    )}
                  </div>

                  {/* Genres */}
                  {movieDetail.genres && movieDetail.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
                      {movieDetail.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Synopsis */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
                    <p className="text-gray-300 leading-relaxed">
                      {movieDetail.overview || "No synopsis available."}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-8">
                    {movieDetail.homepage && (
                      <a
                        href={movieDetail.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Official Website
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ml-2 h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                    
                    {movieDetail.imdb_id && (
                      <a
                        href={`https://www.imdb.com/title/${movieDetail.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                      >
                        IMDb
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="ml-2 h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Production Companies */}
              {movieDetail.production_companies && movieDetail.production_companies.length > 0 && (
                <div className="mt-12 mb-8">
                  <h2 className="text-xl font-semibold mb-6">Production Companies</h2>
                  <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                    {movieDetail.production_companies
                      .filter(company => company.logo_path)
                      .map((company) => (
                        <div key={company.id} className="flex flex-col items-center">
                          <img
                            src={`https://image.tmdb.org/t/p/original${company.logo_path}`}
                            alt={company.name}
                            className="h-12 w-auto max-w-[120px] object-contain mb-2"
                          />
                          <span className="text-gray-400 text-sm">{company.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;

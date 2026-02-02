import React from "react";
import { Link } from "react-router-dom";

export default function MovieList({ movies }) {
  const baseImgUrl = process.env.REACT_APP_BASEIMGURL;

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No movies found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map((movie) => (
        <Link
          to={`/list/${movie.type}/detail/${movie.id}`}
          key={movie.id}
          className="group block no-underline"
        >
          <div className="relative overflow-hidden rounded-lg bg-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            {/* Movie Poster */}
            <div className="aspect-[2/3] overflow-hidden">
              <img
                src={`${baseImgUrl}/${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            </div>

            {/* Overlay Information */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                  {movie.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-300">
                  <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Badge */}
            {movie.vote_average && (
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
                ★ {movie.vote_average.toFixed(1)}
              </div>
            )}
          </div>

          {/* Movie Title (always visible) */}
          <div className="mt-2">
            <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">
              {movie.title}
            </h3>
            <p className="text-gray-400 text-xs mt-1">
              {movie.release_date?.split('-')[0] || 'N/A'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export default function MovieList({ movies, type }) {
  const baseImgUrl = process.env.REACT_APP_BASEIMGURL;

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No movies found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map((movie) => {
        const listType = type || "movie";

        return (
          <Link
            to={`/list/${listType}/detail/${movie.id}`}
            key={movie.id}
            // Kontainer utama: Dibuat lebih rounded, ada shadow yang glow saat di-hover, dan efek naik ke atas (-translate-y)
            className="group block relative overflow-hidden rounded-2xl aspect-[2/3] bg-gray-900 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 md:hover:shadow-blue-500/30"
          >
            {/* Poster Film: Efek zoom perlahan saat di-hover */}
            <img
              src={movie.poster_path ? `${baseImgUrl}/${movie.poster_path}` : "/no_image_available.jpg"}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />

            {/* Gradient Overlay: 
                - Normal: Cuma gelap di bawah agar teks terbaca.
                - Hover: Gelapnya naik sedikit biar info extra kelihatan. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Rating Badge (Top Right): Pakai efek Glassmorphism (blur) */}
            {movie.vote_average > 0 && (
              <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md border border-white/10 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg transition-transform duration-300 group-hover:scale-105">
                <span className="text-yellow-400 text-sm">★</span> 
                {movie.vote_average.toFixed(1)}
              </div>
            )}

            {/* Konten Text (Bottom): Ada animasi slide-up (naik dari bawah) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 transition-transform duration-500 ease-out group-hover:translate-y-0">
              
              <h3 className="text-white font-bold text-sm md:text-base leading-snug mb-1 line-clamp-2 drop-shadow-lg">
                {movie.title}
              </h3>
              
              {/* Info Tambahan: Awalnya ngumpet (opacity-0), pas di-hover baru muncul perlahan */}
              <div className="flex items-center justify-between mt-2 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
                <span className="text-gray-300 text-xs font-medium bg-white/10 px-2 py-1 rounded backdrop-blur-sm">
                  {movie.release_date?.split('-')[0] || 'N/A'}
                </span>
                
                <span className="text-blue-400 text-xs font-bold flex items-center gap-1">
                  Detail
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </span>
              </div>

            </div>
          </Link>
        );
      })}
    </div>
  );
}
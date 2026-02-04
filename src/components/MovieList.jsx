import React from "react";
import { Link } from "react-router-dom";

export default function MovieList({ movies, type }) {
  const baseImgUrl = process.env.REACT_APP_BASEIMGURL;

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        {/* UBAH: Warna teks pesan kosong (Abu gelap di Light, Abu terang di Dark) */}
        <p className="text-gray-500 dark:text-gray-400">No movies found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map((movie) => {
        // Tentukan type: prioritaskan prop 'type', jika tidak ada gunakan 'movie'
        const listType = type || "movie";

        return (
          <Link
            to={`/list/${listType}/detail/${movie.id}`}
            key={movie.id}
            className="group block no-underline"
          >
            {/* UBAH CARD CONTAINER:
                1. bg-gray-800  -> bg-white dark:bg-gray-800 (Putih di Light, Abu gelap di Dark)
                2. Tambah border -> border border-gray-200 dark:border-gray-700/50 (Supaya di mode terang card-nya kelihatan batasnya)
                3. Shadow       -> shadow-sm hover:shadow-xl dark:hover:shadow-black/50
            */}
            <div className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 transition-all duration-300 hover:scale-105 hover:shadow-xl dark:hover:shadow-black/50">
              
              {/* Movie Poster */}
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={movie.poster_path ? `${baseImgUrl}/${movie.poster_path}` : "/no_image_available.jpg"}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Overlay Information */}
              {/* Overlay tetap menggunakan text-white karena background-nya gradient hitam (tetap bagus di light/dark mode) */}
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

              {/* Rating Badge (Tetap dark bg karena kontras tinggi di atas gambar) */}
              {movie.vote_average && (
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
                  ★ {movie.vote_average.toFixed(1)}
                </div>
              )}
            </div>

            {/* Movie Title (always visible) */}
            <div className="mt-2">
              {/* UBAH TEXT JUDUL:
                  1. text-white -> text-gray-900 dark:text-white (Hitam di Light, Putih di Dark)
                  2. Hover      -> group-hover:text-blue-600 dark:group-hover:text-blue-400
              */}
              <h3 className="text-gray-900 dark:text-white text-sm font-medium line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {movie.title}
              </h3>
              
              {/* UBAH TEXT TAHUN: text-gray-400 -> text-gray-500 dark:text-gray-400 */}
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                {movie.release_date?.split('-')[0] || 'N/A'}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
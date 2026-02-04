import axios from "axios";

const apiKey = process.env.REACT_APP_APIKEY;
const baseUrl = process.env.REACT_APP_BASEURL;

// HELPER: Fetch 25 halaman sekaligus (500 Data)
// PERINGATAN: Loading mungkin butuh 2-4 detik tergantung internet
const fetchMultiplePages = async (urlEndpoint, params = "") => {
  try {
    const promises = [];
    // Loop dari page 1 sampai 25 (Total 500 data)
    for (let i = 1; i <= 25; i++) {
      promises.push(
        axios.get(`${baseUrl}${urlEndpoint}?page=${i}&api_key=${apiKey}${params}`)
      );
    }
    
    const responses = await Promise.all(promises);
    const allMovies = responses.flatMap(response => response.data.results);
    
    // Hapus duplikat
    const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());
    
    return uniqueMovies;
  } catch (error) {
    console.log("Error fetching multiple pages:", error);
    throw error;
  }
};

// ... (KODE DI BAWAH INI SAMA PERSIS SEPERTI SEBELUMNYA) ...
export const getMovieList = async () => {
  try {
    const movie = await axios.get(`${baseUrl}/movie/popular?page=1&api_key=${apiKey}`);
    return movie.data.results;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const searchMovie = async (q) => {
  return fetchMultiplePages("/search/movie", `&query=${q}`);
};

export const topRatedMovie = async () => {
  const topRated = await axios.get(`${baseUrl}/movie/top_rated?page=1&api_key=${apiKey}`);
  return topRated.data.results;
};

export const nowPlayingMovie = async () => {
  const nowPlaying = await axios.get(`${baseUrl}/movie/now_playing?page=1&api_key=${apiKey}`);
  return nowPlaying.data.results;
};

export const getMovieDetails = async (id) => {
  const movieDetails = await axios.get(`${baseUrl}/movie/${id}?api_key=${apiKey}`);
  return movieDetails.data;
};

export const getMovieGenres = async () => {
  try {
    const genres = await axios.get(`${baseUrl}/genre/movie/list?api_key=${apiKey}`);
    return genres.data.genres;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const getMoviesByGenre = async (genreId) => {
  return fetchMultiplePages("/discover/movie", `&with_genres=${genreId}`);
};

export const getMoviesByYear = async (year) => {
  return fetchMultiplePages("/discover/movie", `&primary_release_year=${year}`);
};

export const getMoviesByGenreAndYear = async (genreId, year) => {
  return fetchMultiplePages("/discover/movie", `&with_genres=${genreId}&primary_release_year=${year}`);
};

export const getMoviesByCountry = async (countryCode) => {
  return fetchMultiplePages("/discover/movie", `&with_origin_country=${countryCode}`);
};

export const getMoviesByMultipleFilters = async (genreId, year, countryCode) => {
  let params = "";
  if (genreId) params += `&with_genres=${genreId}`;
  if (year) params += `&primary_release_year=${year}`;
  if (countryCode) params += `&with_origin_country=${countryCode}`;
  
  return fetchMultiplePages("/discover/movie", params);
};

export const getCountries = () => {
  return [
    { iso_3166_1: "AR", english_name: "Argentina" },
    { iso_3166_1: "AU", english_name: "Australia" },
    { iso_3166_1: "AT", english_name: "Austria" },
    { iso_3166_1: "BE", english_name: "Belgium" },
    { iso_3166_1: "BR", english_name: "Brazil" },
    { iso_3166_1: "BG", english_name: "Bulgaria" },
    { iso_3166_1: "CA", english_name: "Canada" },
    { iso_3166_1: "CL", english_name: "Chile" },
    { iso_3166_1: "CN", english_name: "China" },
    { iso_3166_1: "CO", english_name: "Colombia" },
    { iso_3166_1: "CZ", english_name: "Czech Republic" },
    { iso_3166_1: "DK", english_name: "Denmark" },
    { iso_3166_1: "EG", english_name: "Egypt" },
    { iso_3166_1: "FI", english_name: "Finland" },
    { iso_3166_1: "FR", english_name: "France" },
    { iso_3166_1: "DE", english_name: "Germany" },
    { iso_3166_1: "GR", english_name: "Greece" },
    { iso_3166_1: "HK", english_name: "Hong Kong" },
    { iso_3166_1: "HU", english_name: "Hungary" },
    { iso_3166_1: "IN", english_name: "India" },
    { iso_3166_1: "ID", english_name: "Indonesia" },
    { iso_3166_1: "IE", english_name: "Ireland" },
    { iso_3166_1: "IL", english_name: "Israel" },
    { iso_3166_1: "IT", english_name: "Italy" },
    { iso_3166_1: "JP", english_name: "Japan" },
    { iso_3166_1: "MY", english_name: "Malaysia" },
    { iso_3166_1: "MX", english_name: "Mexico" },
    { iso_3166_1: "NL", english_name: "Netherlands" },
    { iso_3166_1: "NZ", english_name: "New Zealand" },
    { iso_3166_1: "NO", english_name: "Norway" },
    { iso_3166_1: "PE", english_name: "Peru" },
    { iso_3166_1: "PH", english_name: "Philippines" },
    { iso_3166_1: "PL", english_name: "Poland" },
    { iso_3166_1: "PT", english_name: "Portugal" },
    { iso_3166_1: "RO", english_name: "Romania" },
    { iso_3166_1: "RU", english_name: "Russia" },
    { iso_3166_1: "SG", english_name: "Singapore" },
    { iso_3166_1: "ZA", english_name: "South Africa" },
    { iso_3166_1: "KR", english_name: "South Korea" },
    { iso_3166_1: "ES", english_name: "Spain" },
    { iso_3166_1: "SE", english_name: "Sweden" },
    { iso_3166_1: "CH", english_name: "Switzerland" },
    { iso_3166_1: "TW", english_name: "Taiwan" },
    { iso_3166_1: "TH", english_name: "Thailand" },
    { iso_3166_1: "TR", english_name: "Turkey" },
    { iso_3166_1: "GB", english_name: "United Kingdom" },
    { iso_3166_1: "US", english_name: "United States" }
  ];
};

// 1. Ambil Video Trailer
export const getMovieVideos = async (id) => {
  try {
    const videos = await axios.get(`${baseUrl}/movie/${id}/videos?api_key=${apiKey}`);
    return videos.data.results;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
};

// 2. Ambil Daftar Pemain (Cast)
export const getMovieCredits = async (id) => {
  const credits = await axios.get(`${baseUrl}/movie/${id}/credits?api_key=${apiKey}`);
  return credits.data; // Berisi object { cast: [...], crew: [...] }
};

// 3. Ambil Film Similar
export const getSimilarMovies = async (id) => {
  const similar = await axios.get(`${baseUrl}/movie/${id}/similar?page=1&api_key=${apiKey}`);
  return similar.data.results;
};
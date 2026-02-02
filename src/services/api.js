import axios from "axios";

const apiKey = process.env.REACT_APP_APIKEY;
const baseUrl = process.env.REACT_APP_BASEURL;

export const getMovieList = async () => {
  try {
    const movie = await axios.get(`${baseUrl}/movie/popular?page=1&api_key=${apiKey}`);
    // console.log({ movie: movie.data.results });
    return movie.data.results;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const searchMovie = async (q) => {
  try {
    const search = await axios.get(`${baseUrl}/search/movie?query=${q}&page=1&api_key=${apiKey}`);
    // console.log({ search: movie.data.results });
    return search.data;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const topRatedMovie = async () => {
  try {
    const topRated = await axios.get(`${baseUrl}/movie/top_rated?page=1&api_key=${apiKey}`);
    // console.log({ topRated: movie.data.results });
    return topRated.data.results;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const nowPlayingMovie = async () => {
  try {
    const nowPlaying = await axios.get(`${baseUrl}/movie/now_playing?page=1&api_key=${apiKey}`);
    // console.log({ nowPlaying: movie.data.results });
    return nowPlaying.data.results;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

export const getMovieDetails = async (id) => {
  const movieDetails = await axios.get(`${baseUrl}/movie/${id}?api_key=${apiKey}`);
  // console.log({ movies: movie.data.results });
  return movieDetails.data;
};

// Get movie genres
export const getMovieGenres = async () => {
  try {
    const genres = await axios.get(`${baseUrl}/genre/movie/list?api_key=${apiKey}`);
    return genres.data.genres;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreId) => {
  try {
    const movies = await axios.get(`${baseUrl}/discover/movie?with_genres=${genreId}&page=1&api_key=${apiKey}`);
    return movies.data.results;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

// Get movies by year
export const getMoviesByYear = async (year) => {
  try {
    const movies = await axios.get(`${baseUrl}/discover/movie?primary_release_year=${year}&page=1&api_key=${apiKey}`);
    return movies.data.results;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

// Get movies by genre and year
export const getMoviesByGenreAndYear = async (genreId, year) => {
  try {
    const movies = await axios.get(`${baseUrl}/discover/movie?with_genres=${genreId}&primary_release_year=${year}&page=1&api_key=${apiKey}`);
    return movies.data.results;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

// Get countries list (common movie production countries)
export const getCountries = () => {
  // Return common movie production countries with their ISO codes
  return [
    { iso_3166_1: "US", english_name: "United States" },
    { iso_3166_1: "GB", english_name: "United Kingdom" },
    { iso_3166_1: "CA", english_name: "Canada" },
    { iso_3166_1: "FR", english_name: "France" },
    { iso_3166_1: "DE", english_name: "Germany" },
    { iso_3166_1: "IT", english_name: "Italy" },
    { iso_3166_1: "ES", english_name: "Spain" },
    { iso_3166_1: "JP", english_name: "Japan" },
    { iso_3166_1: "KR", english_name: "South Korea" },
    { iso_3166_1: "CN", english_name: "China" },
    { iso_3166_1: "IN", english_name: "India" },
    { iso_3166_1: "AU", english_name: "Australia" },
    { iso_3166_1: "MX", english_name: "Mexico" },
    { iso_3166_1: "BR", english_name: "Brazil" },
    { iso_3166_1: "RU", english_name: "Russia" },
    { iso_3166_1: "NL", english_name: "Netherlands" },
    { iso_3166_1: "SE", english_name: "Sweden" },
    { iso_3166_1: "NO", english_name: "Norway" },
    { iso_3166_1: "DK", english_name: "Denmark" },
    { iso_3166_1: "FI", english_name: "Finland" },
    { iso_3166_1: "PL", english_name: "Poland" },
    { iso_3166_1: "CZ", english_name: "Czech Republic" },
    { iso_3166_1: "HU", english_name: "Hungary" },
    { iso_3166_1: "RO", english_name: "Romania" },
    { iso_3166_1: "BG", english_name: "Bulgaria" },
    { iso_3166_1: "GR", english_name: "Greece" },
    { iso_3166_1: "TR", english_name: "Turkey" },
    { iso_3166_1: "IL", english_name: "Israel" },
    { iso_3166_1: "TH", english_name: "Thailand" },
    { iso_3166_1: "SG", english_name: "Singapore" },
    { iso_3166_1: "MY", english_name: "Malaysia" },
    { iso_3166_1: "ID", english_name: "Indonesia" },
    { iso_3166_1: "PH", english_name: "Philippines" },
    { iso_3166_1: "HK", english_name: "Hong Kong" },
    { iso_3166_1: "TW", english_name: "Taiwan" },
    { iso_3166_1: "NZ", english_name: "New Zealand" },
    { iso_3166_1: "ZA", english_name: "South Africa" },
    { iso_3166_1: "EG", english_name: "Egypt" },
    { iso_3166_1: "AR", english_name: "Argentina" },
    { iso_3166_1: "CL", english_name: "Chile" },
    { iso_3166_1: "CO", english_name: "Colombia" },
    { iso_3166_1: "PE", english_name: "Peru" },
    { iso_3166_1: "IE", english_name: "Ireland" },
    { iso_3166_1: "PT", english_name: "Portugal" },
    { iso_3166_1: "BE", english_name: "Belgium" },
    { iso_3166_1: "AT", english_name: "Austria" },
    { iso_3166_1: "CH", english_name: "Switzerland" }
  ];
};

// Get movies by country
export const getMoviesByCountry = async (countryCode) => {
  try {
    const movies = await axios.get(`${baseUrl}/discover/movie?with_origin_country=${countryCode}&page=1&api_key=${apiKey}`);
    return movies.data.results;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

// Get movies by multiple filters (genre, year, country)
export const getMoviesByMultipleFilters = async (genreId, year, countryCode) => {
  try {
    let url = `${baseUrl}/discover/movie?page=1&api_key=${apiKey}`;
    
    if (genreId) url += `&with_genres=${genreId}`;
    if (year) url += `&primary_release_year=${year}`;
    if (countryCode) url += `&with_origin_country=${countryCode}`;
    
    const movies = await axios.get(url);
    return movies.data.results;
  } catch (error) {
    console.log("Error:", error);
    throw error;
  }
};

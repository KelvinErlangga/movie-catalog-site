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

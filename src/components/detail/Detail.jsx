import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails } from "../../services/api";
import NavBar from "../../pages/Navbar";

const Detail = () => {
  const [movieDetail, setMovieDetail] = useState();
  const { id } = useParams();
  const baseImgUrl = process.env.REACT_APP_BASEIMGURL;

  useEffect(() => {
    getMovieDetails(id)
      .then((result) => {
        setMovieDetail(result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  console.log({ movieDetail: movieDetail });

  return (
    <>
      <NavBar />
      <div className="w-full flex flex-col items-center">
        <div className="w-full">
          <img className="w-full max-w-screen-xl h-[500px] object-cover mx-auto object-top" src={`${baseImgUrl}${movieDetail?.backdrop_path || "no_image_available.jpg"}`} alt="" />
        </div>
        <div className="w-3/4 flex items-center relative bottom-52 mx-auto">
          <div className="mr-8">
            <div className="w-60">
              <img className="w-full rounded-md shadow-xl" src={`${baseImgUrl}${movieDetail?.poster_path || "no_image_available.jpg"}`} alt="" />
            </div>
          </div>
          <div className="text-white flex flex-col justify-between ">
            <div>
              <div className="font-semibold text-3xl">{movieDetail?.original_title || "no title found"}</div>
              <div className="text-gray-400 text-sm">{movieDetail?.tagline || "no tagline found"}</div>
              <div className="text-yellow-400">
                {movieDetail?.vote_average || "no rate found"} <i className="fas fa-star" />
                <span className="text-sm">{movieDetail ? `(${movieDetail.vote_count} votes)` : ""}</span>
              </div>
              <div className="text-sm">{movieDetail?.runtime + " mins" || "no runtime found"}</div>
              <div className="text-sm">
                {"Release date: " + (movieDetail?.release_date || "no release date found")} <i className="fas fa-star" />
              </div>
              <div className="flex space-x-2 mt-5">
                {movieDetail?.genres?.map((genre) => (
                  <span className="border border-white rounded-full px-2 py-1" id={genre.id} key={genre.id}>
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <div className="font-semibold text-2xl mb-4">Synopsis</div>
              <div>{movieDetail?.overview || ""}</div>
            </div>
          </div>
        </div>
        <div className="flex justify-between w-3/4 relative bottom-24">
          <div className="flex flex-col space-y-4">
            <div className="font-semibold text-2xl">Useful Links</div>
            {movieDetail?.homepage && (
              <a href={movieDetail.homepage} target="_blank" rel="noopener noreferrer" className="text-white text-lg no-underline">
                <p className="bg-red-500 py-2 px-4 rounded-full flex items-center">
                  Homepage <i className="newTab fas fa-external-link-alt ml-2" />
                </p>
              </a>
            )}
            {movieDetail?.imdb_id && (
              <a href={`https://www.imdb.com/title/${movieDetail.imdb_id}`} target="_blank" rel="noopener noreferrer" className="text-white text-lg no-underline">
                <p className="bg-yellow-400 py-2 px-4 rounded-full flex items-center">
                  IMDb
                  <i className="newTab fas fa-external-link-alt ml-2" />
                </p>
              </a>
            )}
          </div>
        </div>
        <div className="font-semibold text-2xl w-4/5 mb-10">Production companies</div>
        <div className="w-5/6 flex justify-center items-end">
          {movieDetail?.production_companies?.map((company) =>
            company.logo_path ? (
              <span className="flex flex-col items-center" key={company.id}>
                <img className="w-48 h-24 object-contain m-4" src={`https://image.tmdb.org/t/p/original${company.logo_path}`} alt={company.name} />
                <span className="text-white">{company.name}</span>
              </span>
            ) : null
          )}
        </div>
      </div>
    </>
  );
};

export default Detail;

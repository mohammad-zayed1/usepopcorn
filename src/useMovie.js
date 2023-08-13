import { useState, useEffect } from "react";
export function useMovie(query) {
    const key = "e3fe499f";
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  useEffect(
    function () {
      const controller = new AbortController(); // Browser API
      async function fetchMovies() {
        try {
          setIsLoader(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${key}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          console.log(err.message);

          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoader(false);
        }
      }
      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      //   handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, error, isLoader };
}

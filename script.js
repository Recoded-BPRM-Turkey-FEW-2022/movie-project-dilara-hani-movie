'use strict';
//FOR URL GENERATION
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const PROFILE_BASE_URL = "http://image.tmdb.org/t/p/w185";
const BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
//FOR PAGE CONTENT
const CONTAINER = document.querySelector("#page-content"); // changed class name .container to id #page-content
CONTAINER.classList = ("container-content container-fluid d-flex flex-row flex-wrap justify-content-center text-center mt-4")
//FOR SEARCH BAR
const searchInput = document.getElementById("search-input") 
const searchButton = document.getElementById("search-button") 

// Don't touch this function please
const constructUrl = (path) => {
  return `${TMDB_BASE_URL}/${path}?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}`;
};


// SEARCH BUTTON FUNCTIONALITY

// CREATE SEARCH URL WITH QUERY
const searchUrl = (query) => {
  console.log(query)
  return `${TMDB_BASE_URL}/search/multi?api_key=${atob(
    "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
  )}&query=${query}`;

};
searchButton.addEventListener("click", async (e) =>{ // without async await the promise is not resolved.
  e.preventDefault();
  let query = searchInput.value // what is written into input bar
  console.log(query)
  let movies = await searchMovies(query)
  // console.log(searchMovies(query))  //searchMovies returns a promise.
  console.log(movies) // returns an object
  CONTAINER.innerHTML ="";
  renderMovies(movies.results)
  // searchUrl(query)
})

const searchMovies = async (query) => {
  const url = searchUrl(query);
  const res = await fetch(url);
  const result = res.json();
  console.log(result)
  return result;
};


// MOVIES PAGE
const renderMovies = (movies) => {
  movies.map((movie) => {
    const movieDiv = document.createElement("div");
    movieDiv.classList =("col-lg-3 col-md-4 col-sm-12 m-3 p-0 d-flex flex-column")
    movieDiv.id =("movieDivCard")
    movieDiv.innerHTML = `
    <div class="card w-100 h-100" id="movieCards">
      <img class="card-img-top" src="${BACKDROP_BASE_URL + movie.backdrop_path}" alt="${movie.title} poster">

        <h4>${movie.title}</h4>
           
      <div class="card-body" id="movieOverview">
        <h4 id="overview">Overview</h4>
        <p> ${movie.overview}</p>
      </div>
    </div>
        `;
        
    movieDiv.addEventListener("click", () => {
      movieDetails(movie);
    });
    CONTAINER.appendChild(movieDiv);
  });
};


// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  renderMovie(movieRes);
};

// This function is to fetch movies. You may need to add it or change some part in it in order to apply some of the features.
const fetchMovies = async () => {
  const url = constructUrl(`movie/now_playing`);
  const res = await fetch(url);
  return res.json();
};

// Don't touch this function please. This function is to fetch one movie.
const fetchMovie = async (movieId) => {
  const url = constructUrl(`movie/${movieId}`);
  const res = await fetch(url);
  return res.json();
};

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie) => {
  CONTAINER.innerHTML = `
    <div class="row">
        <div class="col-md-4">
             <img id="movie-backdrop" src=${
               BACKDROP_BASE_URL + movie.backdrop_path
             }>
        </div>
        <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="movie-release-date"><b>Release Date:</b> ${
              movie.release_date
            }</p>
            <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
        </div>
        </div>
            <h3>Actors:</h3>
            <ul id="actors" class="list-unstyled"></ul>
    </div>`;
};

// HOME BUTTON FUNCTIONALITY
const homeButton = async () => {
  CONTAINER.innerHTML="";
  const movies = await fetchMovies();
  renderMovies(movies.results);
}

// Don't touch this function please
const autorun = async () => {
  const movies = await fetchMovies();
  renderMovies(movies.results);
};

document.addEventListener("DOMContentLoaded", autorun);

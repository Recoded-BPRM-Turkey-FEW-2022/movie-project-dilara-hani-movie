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
  console.log("movies",movies)
  console.log("movies.resukts", movies.results)
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
   //IF ACTOR
    if(movie.title === undefined && movie.poster_path === undefined) { //if there is no "title" key in the object
      movieDiv.addEventListener("click", async () => {
        console.log(movie.id)
        const res = await fetchCreditss(movie.id)
        renderActor(movie, res)
      });
    movieDiv.innerHTML = `
    <div class="card w-100 h-100" id="movieCards">
      <img class="card-img-top" src="${BACKDROP_BASE_URL + movie.profile_path}" alt="${movie.name} poster">

        <h4 class="movieTitle">${movie.name}</h4>
        <span class="${voteColor(movie.vote_average)} rounded-right text-light ">Actor</span>
      <div class="card-body" id="movieOverview">
        <h4 id="overview">KNOWN FOR DEPARTMENT</h4>
        <p> ${movie.known_for_department}</p>
      </div>
    </div>
        `;
        
    } else if(movie.title === undefined) { //IF MOVIE BUT NO TITLE, IT HAS NAME KEY
      movieDiv.addEventListener("click", () => {
        movieDetails(movie);
      });
      movieDiv.innerHTML = `
    <div class="card w-100 h-100" id="movieCards">
      <img class="card-img-top" src="${BACKDROP_BASE_URL + movie.poster_path}" alt="${movie.title} poster">

        <h4 class="movieTitle">${movie.name}</h4>
        <span class="${voteColor(movie.vote_average)} rounded-right text-light ">${movie.vote_average}</span>

      <div class="card-body" id="movieOverview">
        <h4 id="overview">Overview</h4>
        <p> ${movie.overview}</p>
      </div>
    </div>
        `;
    } else { //IF IT IS A MOVIE BUT HAVING TITLE
      movieDiv.addEventListener("click", () => {
        movieDetails(movie);
      });
    movieDiv.innerHTML = `
    <div class="card w-100 h-100" id="movieCards">
      <img class="card-img-top" src="${BACKDROP_BASE_URL + movie.poster_path}" alt="${movie.title} poster">

        <h4 class="movieTitle">${movie.title}</h4>
        <span class="${voteColor(movie.vote_average)} rounded-right text-light ">${movie.vote_average}</span>

      <div class="card-body" id="movieOverview">
        <h4 id="overview">Overview</h4>
        <p> ${movie.overview}</p>
      </div>
    </div>
        `;
    }
    
    // movieDiv.addEventListener("click", () => {
    //   movieDetails(movie);
    // });
    CONTAINER.appendChild(movieDiv);
  });

}
// COLOR INDICATOR FOR VOTE AVERAGE AND BEING ACTOR
function voteColor(voteAvg){
  if( voteAvg === undefined) { // IT IS AN ACTOR
    return "bg-dark"
  }
  else if(voteAvg>=7) {
    return "bg-success"
  }
  else if (voteAvg<7 && voteAvg>=6) {
    return "bg-primary"
  }
  else if( voteAvg<6 && voteAvg>=4) {
    return "bg-warning"
  } else{
    return "bg-danger"
  }
}
// You may need to add to this function, definitely don't delete it.
const movieDetails = async (movie) => {
  const movieRes = await fetchMovie(movie.id);
  const creditRes= await fetchCredit (movie.id); ///added line to get response of fetching credits
  renderMovie(movieRes, creditRes); 
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

////fetch credits to add cast to the movie page /////

const fetchCredit= async (movieId)=>{
  const url2= constructUrl(`movie/${movieId}/credits`);
  const res2 = await fetch (url2);
  return res2.json();
}

// You'll need to play with this function in order to add features and enhance the style.
const renderMovie = (movie, credit) => {
  console.log(movie.genres[0].id);
  const movieGenresArray= movie.genres
  console.log(movieGenresArray);
  const genreNames= movieGenresArray.map(genre => genre.name)
  const names = genreNames.toString().split(",").join(" , ")

  CONTAINER.innerHTML = `
    <div class="row m-30 text-white text-start" id="movie-page">
        <div class="col-md-5">
            <img id="movie-backdrop" src=${
              BACKDROP_BASE_URL + movie.backdrop_path
            }>
        </div>
        <div class="col-md-6">
          <h2 id="movie-title">${movie.title}</h2>
          <p id="movie-release-date"><b>Release Date:</b> ${
            movie.release_date
          }</p>
          <p id="movie-runtime"><b>Runtime:</b> ${movie.runtime} Minutes</p>
          <h4>Overview:</h4>
          <p id="movie-overview">${movie.overview}</p>
          <h4>Genres:</h4>
          <p id="movie-genres" class="text-secondary"> ${names}</p>
        </div> 
    </div>`;
    // actor credit part
    const actorsCreditPart= document.createElement("div");
    actorsCreditPart.id= "actors"
    const actorHeader= document.createElement("h3");
    actorHeader.innerText= "Actors:"
    actorHeader.classList= "text-white mt-4"
    actorsCreditPart.classList= "row m-20";
    for (let i=0; i<5; i++){
      const movieAcotrCard= document.createElement("div");
      movieAcotrCard.id= "actors-cards"
      movieAcotrCard.classList= "card col-lg-3 col-md-4 col-sm-12 m-3 p-0 d-flex flex-column";
      const cardImg= document.createElement("img");
      cardImg.classList= "single-actor-img"
      cardImg.src=`${PROFILE_BASE_URL + credit.cast[i].profile_path}`;
      const cardTitle= document.createElement("p");
      cardTitle.innerText= `${credit.cast[i].name}`;
      movieAcotrCard.appendChild(cardImg);
      movieAcotrCard.appendChild(cardTitle);
    
      CONTAINER.appendChild(actorHeader)
      actorsCreditPart.appendChild(movieAcotrCard)
      CONTAINER.appendChild(actorsCreditPart)
      const actorCards= document.querySelectorAll(".single-actor-img");
      actorCards.forEach(actorCard => {
      actorCard.addEventListener("click",async()=>{
        const res1=await fetchActor(credit.cast[i].id)
        console.log(res1)
        const res2=await fetchCreditss(credit.cast[i].id)
        renderActor(res1, res2);
      })
      })
  }
  };

 /////fetching actors and creating actors page/////

const actorDetails = async (actor) => {
  const actorRes = await fetchActor(actor.id);
  const credRes = await fetchCreditss(actor.id);
  console.log(credRes)
  renderActor(actorRes, credRes);
};

const fetchActors = async () => {
  const url = constructUrl(`person/popular`);
  const res = await fetch(url);
  return res.json();
};

const fetchActor = async (actorId) => {
  const url = constructUrl(`person/${actorId}`);
  const res = await fetch(url);
  // console.log(res.json())
  return res.json();
};

const actorList= document.getElementById('actor-list')
actorList.addEventListener('click',async ()=>{
  const actors = await fetchActors();
renderActors(actors.results);
})


const fetchCreditss= async (actorId)=>{
  const url3= constructUrl(`person/${actorId}/movie_credits`);
  const res3 = await fetch (url3);
  return res3.json();
}

// this function to render entire actors page //
const renderActors = (actors) => {
  CONTAINER.innerHTML=""
  actors.map((actor) => {
    const actorDiv = document.createElement("div");
    actorDiv.classList =("col-lg-2 col-md-3 col-sm-4 m-3 p-0 d-flex flex-column")
    actorDiv.id =("actorDivCard")
    actorDiv.innerHTML = `
    <div class="card w-100 h-100" id="movieCards">
      <img class="card-img-top" src="${PROFILE_BASE_URL + actor.profile_path}">
      <h3 class="card-title">${actor.name}</h3>
      </div>
    </div>
        `;
      actorDiv.addEventListener("click", () => {
      actorDetails(actor);
    });
    CONTAINER.appendChild(actorDiv);
  });
};
 
// this function to render single actor page //
const renderActor = (actor, cred) => {
  // console.log(actor)
  // console.log(cred)
  let actorGender= ""
  if(actor.gender===1){actorGender="Female"}else if (actor.gender===2){actorGender="Male"}
  CONTAINER.innerHTML = `
    <div class="row m-30 text-white text-start" id="actor-page">
      <div class="col-md-3 profile">
            <img id="movie-backdrop" src=${
              PROFILE_BASE_URL + actor.profile_path}>
        </div>
        <div class="col-md-7 details">
            <h2 id="movie-title">${actor.name}</h2>
            <p>${actor.biography}</p>
            <h3>Birthday:</h3>
            <p>${actor.birthday}</p>
            <h3>Gender:</h3>
            <p>${actorGender}</p>
            <h3>Popularity:</h3>
            <p>${actor.popularity}</p>
        </div>
    </div>`;
    //movie credits part
    const movieCreditPart= document.createElement("div");
    movieCreditPart.classList= " col-md-4"
    movieCreditPart.id= "movie-credit"
    const movieHeader= document.createElement("h3");
    movieHeader.innerText= "Movies:";
    movieHeader.classList= "text-white mt-4"
    for (let i=0; i<5; i++){
      const actorMoviesCard= document.createElement("div");
      actorMoviesCard.classList=("")
      const singleMovieCard= document.createElement("div");
      singleMovieCard.id= "single-movie-card"
      singleMovieCard.classList=("single-movie-card card col-lg-4 col-md-4 col-sm-12 m-3 p-0 d-flex flex-column");
      const movieTitle= document.createElement("p");
      movieTitle.innerText= `${cred.cast[i].title}`;
      const movieImg= document.createElement("img");
      movieImg.src=`${BACKDROP_BASE_URL + cred.cast[i].poster_path}`;
      singleMovieCard.appendChild(movieImg);
      singleMovieCard.appendChild(movieTitle);
      actorMoviesCard.appendChild(singleMovieCard)

      CONTAINER.appendChild(movieHeader)
      movieCreditPart.appendChild(actorMoviesCard)
      CONTAINER.appendChild(movieCreditPart)
      
      const MovieCards= document.querySelectorAll(".single-movie-card");
      MovieCards.forEach(card=>{
        card.addEventListener("click",async()=>{
          const res1=await fetchMovie(cred.cast[i].id)
          console.log(res1)
          const res2=await fetchCredit(cred.cast[i].id)
          renderMovie(res1, res2);
        })
      })
    }
};

////filter button with dropdown list////
///first: top rated movies///////

const topRatedButton= document.getElementById("top-rated")

const fetchTopRated = async () => {
  const url = constructUrl(`movie/top_rated`);
  const res = await fetch(url);
  return res.json();
};

const topDetail = async () => {
  const topRatedRes = await fetchTopRated();
  renderTopRated(topRatedRes);
};
topDetail()
const renderTopRated=(movie)=>{
  topRatedButton.addEventListener("click",()=>{
    CONTAINER.innerHTML="";
    renderMovies(movie.results);
  })
}

///second: upcoming movies///////

const upcomingButton= document.getElementById("upcoming")

const fetchUpcoming = async () => {
  const url = constructUrl(`movie/upcoming`);
  const res = await fetch(url);
  return res.json();
};

const upcomingDetail = async () => {
  const upcomingRes = await fetchUpcoming();
  renderUpcoming(upcomingRes);
};
upcomingDetail()
const renderUpcoming=(movie)=>{
  upcomingButton.addEventListener("click",()=>{
    CONTAINER.innerHTML="";
    renderMovies(movie.results);
  })
}

///third: popular movies///////

const popularButton= document.getElementById("popular")

const fetchPopular = async () => {
  const url = constructUrl(`movie/popular`);
  const res = await fetch(url);
  return res.json();
};

const popularDetail = async () => {
  const popularRes = await fetchPopular();
  renderPopular(popularRes);
};
popularDetail()
const renderPopular=(movie)=>{
  popularButton.addEventListener("click",()=>{
    CONTAINER.innerHTML="";
    renderMovies(movie.results);
  })
}

// NAVBAR ABOUT PAGE FUNCTIONALITY
const aboutPage = () => {
  CONTAINER.innerHTML="";
  CONTAINER.innerHTML= `
  <div class="container-fluid" id="about-page">
  <div class="d-flex flex-column">
      <p>This project has been done by using TMDB API in Re:Coded Front End Bootcamp</p>
      <p><b><a class="nav-link" href="https://www.themoviedb.org/documentation/api#:~:text=What%20is%20TMDB's%20API%3F,our%20data%20and%2For%20images." target="_blank">TMDB API</a></b></p>
      <p>The TMDB's API service is for those of who are interested in using movie, TV show or actor images and/or data that can be programmatically fetched for website applications.</p>
  </div>
  <div class="d-flex flex-column">
      <p><b><a class="nav-link" href="https://www.re-coded.com/" target="_blank">RE:CODED</a></b></p>
      <p>Re:Coded's goal is to unlock human potential and open doors to the digital economy, regardless of circumstance. Re:Coded offer transformative learning experiences for under-represented talent and provide them with the skills, resources and networks to launch new in-demand careers in tech</p>
  </div>
  </div>
   `;
}


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

////// genre fetching and making a dropdown list////

const genreList= document.getElementById("genreDropdown")

const fetchGenres = async () => {
  const url = constructUrl(`genre/movie/list`);
  const res = await fetch(url);
  // console.log(res.json())
  return res.json();
};

const fetchGen = async (gen) => {
  const genreURL= `${constructUrl(`discover/movie`)}&with_genres=${gen}`;
  const res= await fetch(genreURL)
  return res.json()
  // console.log(genreURL);
};

const genresDetailllll = async (genId) => {
  const genRes = await fetchGen(genId);
  // console.log(genRes)
  CONTAINER.innerHTML="";
  renderMovies(genRes.results);
};

const genresDetails = async () => {
  const genRes = await fetchGenres();
  renderGenres(genRes);
};
genresDetails()
const renderGenres = (genres) => {
  for (let genre of Object.keys(genres)){
    let genIter= genres[genre];
    genIter.map((gen)=>{
      const genreItem= document.createElement("li");
      const genreAnch= document.createElement("a");
      genreItem.appendChild(genreAnch);
      genreAnch.classList= ("dropdown-item")
      genreAnch.id= gen.id;
      genreAnch.href= ("#")
      genreAnch.innerText= gen.name;
      genreAnch.addEventListener("click",async()=>{
        genresDetailllll(gen.id)
      })
      genreList.appendChild(genreItem)
    })
  }
  };

document.addEventListener("DOMContentLoaded", autorun);

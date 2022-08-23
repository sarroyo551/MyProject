const tagWhitelist = ["rock", "country", "pop", "hip hop", "blues", "alternative rock", "pop rock", "funk", "electronic music", "latin pop", "classical music", "soul music", "indie rock", "techno", "punk rock", "rhythm and blues", "R&B", "heavy metal", "jazz", "reggae", "k-pop", "house music", "disco", "rap", "folk", "EDM", "soul", "grunge", "gospel", "trap", "guitar music"];

const form = document.querySelector("#artist-search"); // grabbing html elements
const artistName = document.querySelector("#artist-name");
const artistResults = document.querySelector("#artist-results");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");

const pageLength = 10; //amount of artists is limited to 10 per page
let currentPage = 0;
let pages;
let query;
let cooldown = false; //will be used for setTimeout & makeRequest

function makeRequest() {
  if (cooldown) { 
    return Promise.reject("Too soon"); 
  }

  cooldown = true;

  const url = `https://musicbrainz.org/ws/2/artist?query=${query}&fmt=json&limit=${pageLength}&offset=${
    currentPage * pageLength  
  }`; //creating the API url with the current parameters (query, pageLength, currentPage * pageLength)
  return fetch(url).then((res) => { 
    setTimeout(() => { //used in order to make sure that we dont send the API request more than once per second
      cooldown = false;
    }, 1000); //setTimeout will prevent user from clicking more than once a second
    return res.json();
  });
}
//console.log(makeRequest())

form.addEventListener("submit", (evt) => {
  evt.preventDefault(); // prevents the default behaviour of the browser

  currentPage = 0; // on each new search make sure we're at page one
  query = artistName.value; // we remember the value of the users query when the confirm their search
  makeRequest() // calls makeRequest, returns promise.. and THEN
    .then((data) => {
      const artists = data.artists; //artist is assigned to the arists in the data
      //console.log(data.count) 
      renderArtists(artists);
      pages = Math.ceil(data.count / pageLength); //calculating the number of pages by the number of responses by the number of entries per page
      if (pages > 1) { //if we have more than one page we enable the next button
        nextButton.removeAttribute("disabled"); 
      }
      prevButton.setAttribute("disabled", ''); //since we start off at page 0 we disable the previous button
    })
    .catch((err) => {});
});


function updateQuery() { 
  makeRequest().then((data) => {
    const artists = data.artists;
    console.log(data.artists)
    renderArtists(artists);
  });
}

nextButton.addEventListener("click", () => {
  //event listener (click) for nextButton
  if (cooldown) {
    return;
  }
  currentPage++; //incriments current page by one
  prevButton.removeAttribute("disabled");
  if (currentPage === pages) {
    nextButton.setAttribute("disabled", "");
  }
  updateQuery();
});

prevButton.addEventListener("click", () => {
  //event listener (click) for prevButton
  if (cooldown) {
    return; //if you return here you wont get to to the end of the eventListener
  }
  currentPage--; //reduce current page by one
  nextButton.removeAttribute("disabled");
  if (currentPage === 0) {
    prevButton.setAttribute("disabled", "");
  }
  updateQuery();
});//almost identical to nextButton

function renderArtists(artists) { // renders data from artists into html
  artistResults.innerHTML = ""; //removes search answers once you look for a different artist

  for (let i = 0; i < artists.length; i++) {
    renderArtist(artists[i]) //calls render artist for every artist passing artists at index i as argument
  }
}

function renderArtist(artist) {
  const container = document.createElement("div");
  container.classList.add("artist-container"); //made a div called container and made it the class of 'artist-container'
  container.classList.add("center")//centering container div

  const nameEl = document.createElement("h1");
  nameEl.innerText = artist.name;//made a h1 that will be assigned to the artist name (the search answers will be h1s)
  container.appendChild(nameEl); //appended nameEL (h1) to the container div ('artist-container')

  const areaEl = document.createElement("p"); //areaEl will be a 'p', it should give the response of the area belonging to the artist (i.e. country of origin)
  // areaEl.innerText = artist.area?.name || ""; //short hand for the following if statement
  if (artist.area) {
    areaEl.innerText = artist.area.name;
  }
  container.appendChild(areaEl); //appeneded areaEl to the container div (artist-container).. it should show up bellow the artist that is received from response.

  const tagsEl = document.createElement("p"); //created another 'p' element 
  if (artist.tags) {
    tagsEl.innerText = artist.tags //tagsEl should show the tags(gengre) of the artist as long as it is in the whitelist. if it is not, it will not show information. this is to prevent tags that are not the genre.
      .map((tag) => tag.name)
      .filter((tagName) => tagWhitelist.includes(tagName)) 
      .join();
  }
  container.appendChild(tagsEl); 

  artistResults.appendChild(container);


}
const tagWhitelist = ["rock", "country", "pop"];

const form = document.querySelector("#artist-search"); // grabbing html elements
const artistName = document.querySelector("#artist-name");
const artistResults = document.querySelector("#artist-results");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");

const pageLength = 10; //amount of artists is limited to 10 per page
let currentPage = 0;
let pages;
let query;
let cooldown = false; //will be used for setTimeout

function makeRequest() {
  if (cooldown) {
    return Promise.reject("Too soon");
  }

  cooldown = true;

  const url = `https://musicbrainz.org/ws/2/artist?query=${query}&fmt=json&limit=${pageLength}&offset=${
    currentPage * pageLength
  }`; //fetching data from API
  return fetch(url).then((res) => {
    setTimeout(() => {
      cooldown = false;
    }, 1000); //setTimeout will prevent user from clicking more than once a second
    return res.json();
  });
}

form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  currentPage = 0;
  query = artistName.value; //query takes the artistName value
  makeRequest() //calls makeRequest
    .then((data) => {
      const artists = data.artists; //artist is assigned to the arists in the data
      renderArtists(artists);
      pages = Math.ceil(data.count / pageLength); //rounding pages up with the argument of the count in the data by the pageLength (10)
      if (pages > 1) { //once pages is greater than one the disabled button will be removed. next button is not disabled at the start
        nextButton.removeAttribute("disabled");
      }
    })
    .catch((err) => {});
});

function updateQuery() {
  makeRequest().then((data) => {
    const artists = data.artists;
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
    return;
  }
  currentPage--; //deincriments current page by one
  prevButton.removeAttribute("disabled");
  if (currentPage === pages) {
    prevButton.setAttribute("disabled", "");
  }
  updateQuery();
});//almost identical to nextButton

function renderArtists(artists) {
  artistResults.innerHTML = ""; //removes search answers once you look for a different artist
  artists.forEach(renderArtist);
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

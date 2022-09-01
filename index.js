const tagWhitelist = ["rock", "country", "pop", "hip hop", "blues", "alternative rock", "pop rock", "funk", "electronic music", "latin pop", "classical music", "soul music", "indie rock", "techno", "punk rock", "rhythm and blues", "R&B", "heavy metal", "jazz", "reggae", "k-pop", "house music", "disco", "rap", "folk", "EDM", "soul", "grunge", "gospel", "trap", "guitar music"];

const form = document.querySelector("#artist-search"); 
const artistName = document.querySelector("#artist-name");
const artistResults = document.querySelector("#artist-results");
const prevButton = document.querySelector("#prev");
const nextButton = document.querySelector("#next");

const pageLength = 10; 
let currentPage = 0;
let pages;
let query;
let cooldown = false;

function makeRequest() {
  if (cooldown) { 
    return Promise.reject("Too soon"); 
  }

  cooldown = true;

  const url = `https://musicbrainz.org/ws/2/artist?query=${query}&fmt=json&limit=${pageLength}&offset=${
    currentPage * pageLength  
  }`; 
  return fetch(url).then((res) => { 
    setTimeout(() => {

      cooldown = false;
    }, 1000); 
    return res.json();
  });
}
//console.log(makeRequest())

form.addEventListener("submit", (evt) => {
  evt.preventDefault(); 

  currentPage = 0; 
  query = artistName.value; 
  makeRequest() 
    .then((data) => {
      debugger 
      const artists = data.artists;
      //console.log(data.count) 
      renderArtists(artists);
      pages = Math.ceil(data.count / pageLength); 
      if (pages > 1) { 
        nextButton.removeAttribute("disabled"); 
      }
      prevButton.setAttribute("disabled", ''); 
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
  
  if (cooldown) {
    return;
  }
  currentPage++; 
  prevButton.removeAttribute("disabled");
  if (currentPage === pages) {
    nextButton.setAttribute("disabled", "");
  }
  updateQuery();
});

prevButton.addEventListener("click", () => {
  
  if (cooldown) {
    return; 
  }
  currentPage--; 
  nextButton.removeAttribute("disabled");
  if (currentPage === 0) {
    prevButton.setAttribute("disabled", "");
  }
  updateQuery();
});

function renderArtists(artists) { 
  artistResults.innerHTML = ""; 

  for (let i = 0; i < artists.length; i++) {
    renderArtist(artists[i]) 
  }
}

function renderArtist(artist) {
  const container = document.createElement("div");
  container.classList.add("artist-container"); 
  container.classList.add("center")

  const nameEl = document.createElement("h1");
  nameEl.innerText = artist.name;
  container.appendChild(nameEl); 

  const areaEl = document.createElement("p"); 

  if (artist.area) {
    areaEl.innerText = artist.area.name;
  }
  container.appendChild(areaEl); 

  const tagsEl = document.createElement("p"); 
  if (artist.tags) {
    tagsEl.innerText = artist.tags 
      .map((tag) => tag.name)
      .filter((tagName) => tagWhitelist.includes(tagName)) 
      .join(', ');
  }
  container.appendChild(tagsEl); 

  artistResults.appendChild(container);

}
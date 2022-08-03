const form = document.querySelector("#artist-search");
const artistName = document.querySelector("#artist-name");
const artistResults = document.querySelector("#artist-results")
const prevButton = document.querySelector("#prev")
const nextButton = document.querySelector("#next")

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
    }`;                       //fetching data from API
    return fetch(url).then((res) => {
      setTimeout(() => {
        cooldown = false;
      }, 1000);              //setTimeout will prevent user from clicking more than once a second
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
        pages = Math.ceil(data.count / pageLength);
        if (pages > 1) {
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
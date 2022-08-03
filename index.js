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
});

function renderArtists(artists) {
  artistResults.innerHTML = "";
  artists.forEach(renderArtist);
}

function renderArtist(artist) {
  const container = document.createElement("div");
  container.classList.add("artist-container");

  const nameEl = document.createElement("h1");
  nameEl.innerText = artist.name;
  container.appendChild(nameEl);

  const areaEl = document.createElement("p");
  // areaEl.innerText = artist.area?.name || "";
  if (artist.area) {
    areaEl.innerText = artist.area.name;
  }
  container.appendChild(areaEl);

  const tagsEl = document.createElement("p");
  if (artist.tags) {
    tagsEl.innerText = artist.tags
      .map((tag) => tag.name)
      .filter((tagName) => tagWhitelist.includes(tagName))
      .join();
  }
  container.appendChild(tagsEl);

  artistResults.appendChild(container);
}

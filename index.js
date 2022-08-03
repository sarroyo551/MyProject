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
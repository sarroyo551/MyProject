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
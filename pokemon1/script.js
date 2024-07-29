const baseUrl = "https://pokeapi.co/api/v2/pokemon";
let allPokemons = [];
let currentPokemon= [];
let offset = 0;
const limit = 24;


function init() {
  displayPokemon();
  eventLLoadMoreAndSearch();
}

async function fetchPokemon(offset, limit) {
  try {
    const response = await fetch(`${baseUrl}?offset=${offset}&limit=${limit}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error with loading Pokemon-Data", error);
  }
}

async function fetchPokemonDetails(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error with loading Pokemon-Details", error);
  }
}

async function displayPokemon() {
  const pokemonList = await fetchPokemon(offset, limit);
  const pokemonContainer = document.getElementById("pokemon-list");

  for (let i = 0; i < pokemonList.length; i++) {
    const pokemon = pokemonList[i];
    const pokemonDetails = await fetchPokemonDetails(pokemon.url);
    const card = generateCardHTML(pokemonDetails);
    pokemonContainer.appendChild(card);
  }
  setupCardClickListeners(); 
}

async function searchPokemon() {
  let input = document.getElementById("search");
  
  try {
    const pokeNameOrID = input.value.toLowerCase();
    const response = await fetch(`${baseUrl}/${pokeNameOrID}`);
    if (!response.ok) {
      throw new Error("Pokemon not found");
    }
    const data = await response.json();
    displaySearchResults([data]);
  } catch (error) {
    console.error(error);
  }
}

function displaySearchResults(pokemonList) {
  const pokemonContainer = document.getElementById("pokemon-list");
  pokemonContainer.innerHTML = "";
  for (const pokemon of pokemonList) {
    const card = generateCardHTML(pokemon);
    pokemonContainer.appendChild(card);
  }
  setupCardClickListeners();
}

function eventLLoadMoreAndSearch(){
  document.getElementById("load-more").addEventListener("click", () => {
    offset += limit;
    displayPokemon();
  });
  document.getElementById("search").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); 
      searchPokemon();
      switchToGOButton();
    }
  });
}

function switchToGOButton(){
  const button = document.getElementById('load-more');
  button.style.display='none';
  const goButton = document.getElementById('go-back');
  goButton.style.display='flex';
}

function setupCardClickListeners() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", async () => {
      const pokemonID = card
        .querySelector(".indexDisplay")
        .textContent.replace("#", "");
      const response = await fetch(`${baseUrl}/${pokemonID}`);
      const pokemonDetails = await response.json();
      openPopup(pokemonDetails);
    });
  });
}

function generateCardHTML(pokemonDetails) {
  const types = pokemonDetails.types.map(typeInfo => typeInfo.type.name);
  const typeIcons = types.map(type => 
      `<div class="icon-container ${type}">
          <img src="./img/icons/${type}.svg" class="type-icon" alt="${type}">
      </div>`
  ).join(' ');
  const card = document.createElement('div');
  card.className = 'card pokemon-card';
  setPokemonTypeClass(card, pokemonDetails);
  card.innerHTML = cardHTML(pokemonDetails, typeIcons);
  return card;
}

function cardHTML(pokemonDetails, typeIcons){
  return`
  <div class="headline">
  <h2 id="nameOfPokemon">${pokemonDetails.name}</h2>
  <span class="indexDisplay">#${pokemonDetails.id}</span>
  </div>
  <img class="pokeImg" src="${pokemonDetails.sprites.other['official-artwork'].front_default}" alt="${pokemonDetails.name}">
  <div class="footerOfCard">
  <div>${typeIcons}</div>
  </div>`;
}

function setPokemonTypeClass(cardElement, pokemonDetails) {
  const typeClass = `${pokemonDetails.types[0].type.name.toLowerCase()}`;
  cardElement.classList.add(typeClass);
}

function goBack(){
    const content = document.getElementById('pokemon-list');
    content.innerHTML = "";
    const button = document.getElementById('load-more');
    button.style.display='flex';
    const goButton = document.getElementById('go-back');
    goButton.style.display='none';
    displayPokemon();
}

function resetTypeClasses(cardElement) {
  const typeClasses = [
    "normal", "fire", "water", "electric", "grass",
    "ice", "fighting", "poison", "ground", "flying",
    "psychic", "bug", "rock", "ghost","dragon",
    "dark", "steel", "fairy",
  ];
  typeClasses.forEach((typeClass) => cardElement.classList.remove(typeClass));
}




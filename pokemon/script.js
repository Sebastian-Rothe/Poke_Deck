const baseUrl = "https://pokeapi.co/api/v2/pokemon";
let allPokemons = [];
let offset = 0;
const limit = 24;
const searchButton = document.getElementById("search-button");

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

function openPopup(pokemonDetails) {
  const cardPopUp = document.getElementById("pokemon-card-popup");
  cardPopUp.innerHTML = "";
  cardPopUp.innerHTML += generatePopUpHeadHTML(pokemonDetails);
  
  document.body.style.overflow = "hidden";
  // document.getElementById("next-pokemon").addEventListener("click", () => goToNextPokemon(pokemonDetails));
  // goToNextPokemon(pokemonDetails);
  funcToOpenPopUp(cardPopUp, pokemonDetails);
}

function funcToOpenPopUp(cardPopUp, pokemonDetails){
  resetTypeClasses(cardPopUp);
  setPokemonTypeClass(cardPopUp, pokemonDetails);
  setEventListener(pokemonDetails);
  showPopUp();
  showAbout(pokemonDetails);
}

function showPopUp(){
  const popup = document.getElementById("pokemon-popup");
  popup.style.display = "flex"; 
  popUpEventListener(popup);
}

function popUpEventListener(popup){
  popup.addEventListener("click", function (event) {
    if (event.target === popup) {
      popup.style.display = "none"; 
      document.body.style.overflow = "auto";
    }
  });
}

function setEventListener(pokemonDetails){
  document
    .getElementById("about")
    .addEventListener("click", () => showAbout(pokemonDetails));
  document
    .getElementById("stats")
    .addEventListener("click", () => showStats(pokemonDetails));
  document
    .getElementById("evolution")
    .addEventListener("click", () => showEvolution(pokemonDetails));
  document
    .getElementById("moves")
    .addEventListener("click", () => showMoves(pokemonDetails));
}

function generatePopUpHeadHTML(pokemonDetails) {
  return `
        <div class="pokemon-card-header">
            <div class="popup-header">
                <h2 id="popup-name">${pokemonDetails.name}</h2>
            </div>
            <img id="popup-image" src="${pokemonDetails.sprites.other["official-artwork"].front_default}" alt="${pokemonDetails.name}" alt="Pokemon Image">
            <div id="select-section">
                <button class="select-button" id="about">About</button>
                <button class="select-button" id="stats">Stats</button>
                <button class="select-button" id="evolution">EVO</button>
                <button class="select-button" id="moves">Moves</button>
            </div>
        </div>
        <div id="pokemon-card-body" class="pokemon-card-body"></div>`;
}


function showAbout(pokemonDetails) {
  const cardBody = document.getElementById("pokemon-card-body");
  cardBody.innerHTML = `
    <div class="about-section">
        <h3 class="section-title">About</h3>
        <div class="about-info">
            <div class="about-item about-type-div">
                <strong>Type:</strong>
                <div class="type-container">
                    ${pokemonDetails.types.map((typeInfo) =>
                          `<span class="type-button ${typeInfo.type.name
                          }">${typeInfo.type.name.toUpperCase()}</span>`
                      ).join(" ")}
                </div>
            </div>
            <div class="about-item">
                <strong>Abilities:</strong> ${pokemonDetails.abilities
                  .map((abilityInfo) => abilityInfo.ability.name)
                  .join(", ")}
            </div>
            <div class="about-item">
                <strong>Weight:</strong> ${
                  pokemonDetails.weight / 10} kg
            </div>
            <div class="about-item">
                <strong>Height:</strong> <span class="ajust-span">${
                  pokemonDetails.height * 10} cm</span>
            </div>
            <div class="about-item">
                <strong>Base Experience:</strong> ${
                  pokemonDetails.base_experience}
            </div>
        </div>
    </div>`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function showStats(pokemonDetails) {
    const cardBody = document.getElementById('pokemon-card-body');
    cardBody.innerHTML = `
      <div class="stats-section">
          <h3>Base Stats</h3>
          <ul>
            ${pokemonDetails.stats.map(statInfo => `
                <li class="stat-item">
                    <span class="stat-name">${formatStatName(statInfo.stat.name)}:</span>
                    <div class="stat-bar">
                        <div class="stat-bar-fill" style="width: ${statInfo.base_stat / 1.2}%;"></div>
                    </div>
                    <span class="stat-value">${statInfo.base_stat}</span>
                </li>`).join('')}
          </ul>
      </div>`;
}

function formatStatName(statName) {
    switch (statName) {
        case 'special-attack':
            return 'Sp. Atk';
        case 'special-defense':
            return 'Sp. Def';
        default:
            return statName.charAt(0).toUpperCase() + statName.slice(1);
    }
}

async function showEvolution(pokemonDetails) {
  const evolutionData = await getEvolutionData(pokemonDetails.species.url);
  const cardBody = document.getElementById("pokemon-card-body");
  cardBody.innerHTML = `
        <div class="evolution-section">
            <h3>Evolution Chain</h3>
            <div class="evolution-chain">${
              evolutionData ? evolutionData : "No evolution data available"
            }</div>
        </div>`;
}

async function getEvolutionData(speciesUrl) {
  try {
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();
    const evolutionChainUrl = speciesData.evolution_chain.url;

    const evolutionResponse = await fetch(evolutionChainUrl);
    const evolutionData = await evolutionResponse.json();

    return await parseEvolutionChain(evolutionData.chain);
  } catch (error) {
    console.error("Error fetching evolution data:", error);
    return null;
  }
}

async function parseEvolutionChain(chain) {
  return await parseEvolutionChainRecursive(chain);
}

async function parseEvolutionChainRecursive(chain) {
  if (!chain) return "";

  let evolutionChain = await getPokemonHTML(chain.species.url);

  if (chain.evolves_to && chain.evolves_to.length > 0) {
    evolutionChain += `<img src="img/chevron_right.svg" alt="arrow" class="evolution-arrow">`;
    evolutionChain += await parseEvolutionChainRecursive(chain.evolves_to[0]);
  }
  return evolutionChain;
}

async function getPokemonHTML(speciesUrl) {
  try {
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();
    const pokemonId = speciesData.id;
    const pokemonResponse = await fetch(
      `${baseUrl}/${pokemonId}`);
    const pokemonData = await pokemonResponse.json();

    return returnEvoHTML(pokemonData);
  } catch (error) {
    console.error(`Error fetching Pokémon data:`, error);
    return returnEvoError();
  }
}

function returnEvoError(){
  return `
  <div class="evolution-pokemon">
      <p>Image not available</p>
  </div>
`;
}

function returnEvoHTML(pokemonData){
  return `
    <div class="evolution-pokemon">
        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
        <p>${pokemonData.name}</p>
    </div>
  `;
}

function showMoves(pokemonDetails) {
  const cardBody = document.getElementById("pokemon-card-body");
  const moves = pokemonDetails.moves.map((move) => move.move.name).join(", ");

  cardBody.innerHTML = `
        <div class="moves-section">
            <h3>Moves</h3>
            <p>${moves}</p>
        </div>
    `;
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


function goBack(){
    const content = document.getElementById('pokemon-list');
    content.innerHTML = "";
    const button = document.getElementById('load-more');
    button.style.display='flex';
    const goButton = document.getElementById('go-back');
    goButton.style.display='none';
    displayPokemon();
}

async function goToNextPokemon(pokemonDetails){
  const next = pokemonDetails.id + 1;
  console.log(`pokemonDetails.${next}`);
  openPopup(`pokemonDetails.${next}`)
}

{/* <img id="prev-pokemon" class="arrow-prev-next" src="./img/chevron_left.svg" alt="arrow to the Left">
<img id="next-pokemon" class="arrow-prev-next" src="./img/chevron_right.svg" alt="arrow to the Right"> */}

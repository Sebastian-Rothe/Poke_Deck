const baseUrl = "https://pokeapi.co/api/v2/pokemon";
let allPokemons = [];
let offset = 0;
const limit = 24;
const searchButton = document.getElementById('search-button');

function init(){
    fetchPokemon(offset, limit);
    displayPokemon();
    // setupSearch();
}

async function fetchPokemon(offset, limit){
    try {
        const response = await fetch(`${baseUrl}?offset=${offset}&limit=${limit}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error with loading Pokemon-Data', error);
    }
}

async function fetchPokemonDetails(url){
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error with loading Pokemon-Details', error);
    }
}

async function displayPokemon() {
    const pokemonList = await fetchPokemon(offset, limit);
    const pokemonContainer = document.getElementById('pokemon-list');
    
    for (let i = 0; i < pokemonList.length; i++) {
        const pokemon = pokemonList[i];
        const pokemonDetails = await fetchPokemonDetails(pokemon.url);
        const card = generateCardHTML(pokemonDetails);
        pokemonContainer.appendChild(card);
    }
    // part of try
    setupCardClickListeners(); // Setup click listeners after adding cards
}

async function fetchData(){
    try{
        const pokemonIndex = document.getElementById("pokemonIndex").value;
        const response = await fetch(`${ONLOAD_POKE}${pokemonIndex}`);

        if(!response.ok){
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        getPokeImg(data);
    }
    catch(error){
        console.error(error);
    }
}

function getPokeImg(data){
    const pokemonSprite = data.sprites.front_default;
    const imgElement = document.getElementById("poke-sprite");
    imgElement.src = pokemonSprite;
    imgElement.style.display = "block";
}

// Event-Listener für den "Weitere laden" Button
document.getElementById('load-more').addEventListener('click', () => {
    offset += limit;
    displayPokemon();
});


// next 3 func => Searchfunction!!!  
async function searchPokemon(){
    let input = document.getElementById('search');
   
    try {
        const pokeNameOrID = input.value.toLowerCase();
        const response = await fetch(`${baseUrl}/${pokeNameOrID}`);
        if (!response.ok) {
            throw new Error('Pokemon not found');
        }
        const data = await response.json();
        displaySearchResults([data]); 
    } catch (error) {
        console.error(error);
    }
}

function displaySearchResults(pokemonList) {
        const pokemonContainer = document.getElementById('pokemon-list');
        pokemonContainer.innerHTML = ""; // Clear existing content
        for (const pokemon of pokemonList) {
            const card = generateCardHTML(pokemon);
            pokemonContainer.appendChild(card);
        }
}

document.getElementById('search').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Verhindert das Standardverhalten (z.B. Form-Submits)
        searchPokemon();
    }
});

// try

// Function to open the pop-up and display detailed info
function openPopup(pokemonDetails) {
    const popup = document.getElementById('pokemon-popup');
    document.getElementById('popup-name').textContent = pokemonDetails.name;
    document.getElementById('popup-image').src = pokemonDetails.sprites.front_default;
    document.getElementById('popup-types').textContent = `Types: ${pokemonDetails.types.map(typeInfo => typeInfo.type.name).join(', ')}`;
    document.getElementById('popup-height').textContent = `Height: ${pokemonDetails.height / 10} m`; // Convert to meters
    document.getElementById('popup-weight').textContent = `Weight: ${pokemonDetails.weight / 10} kg`; // Convert to kilograms
    document.getElementById('popup-abilities').textContent = `Abilities: ${pokemonDetails.abilities.map(ability => ability.ability.name).join(', ')}`;

    // Stats
    const stats = pokemonDetails.stats.map(stat => `${stat.stat.name}: ${stat.base_stat}`).join(', ');
    document.getElementById('popup-stats').textContent = `Stats: ${stats}`;

    // Evolution (Example, make sure to fetch evolution details if needed)
    // document.getElementById('popup-evolves').textContent = `Evolves to: ${pokemonDetails.evolves_to.map(evo => evo.name).join(', ')}`;

    popup.style.display = 'flex'; // Show the pop-up
}


// Function to close the pop-up
function closePopup() {
    document.getElementById('pokemon-popup').style.display = 'none';
}

// Add event listener for closing the pop-up
document.getElementById('popup-close').addEventListener('click', closePopup);

// Function to handle card clicks
function setupCardClickListeners() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', async () => {
            const pokemonID = card.querySelector('.indexDisplay').textContent.replace('#', '');
            const response = await fetch(`${baseUrl}/${pokemonID}`);
            const pokemonDetails = await response.json();
            openPopup(pokemonDetails);
        });
    });
}

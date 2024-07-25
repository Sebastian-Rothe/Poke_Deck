const baseUrl = "https://pokeapi.co/api/v2/pokemon";
let allPokemons = [];
let offset = 0;
const limit = 24;
const searchButton = document.getElementById('search-button');

function init(){
    fetchPokemon(offset, limit);
    displayPokemon();
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
        
    }
    catch(error){
        console.error(error);
    }
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
        setupCardClickListeners();
}

document.getElementById('search').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Verhindert das Standardverhalten (z.B. Form-Submits)
        searchPokemon();
    }
});



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

function openPopup(pokemonDetails) {
    const popup = document.getElementById('pokemon-popup');
    const cardPopUp = document.getElementById('pokemon-card-popup');
    cardPopUp.innerHTML = '';
    cardPopUp.innerHTML += generatePopUpHeadHTML(pokemonDetails);

    resetTypeClasses(cardPopUp);
    setPokemonTypeClass(cardPopUp, pokemonDetails);

    document.getElementById('about').addEventListener('click', () => showAbout(pokemonDetails));
    document.getElementById('stats').addEventListener('click', () => showStats(pokemonDetails));
    document.getElementById('evolution').addEventListener('click', () => showEvolution(pokemonDetails));
    document.getElementById('more-info').addEventListener('click', () => showMoreInfo(pokemonDetails));
    
    popup.style.display = 'flex'; // Show the pop-up
    popup.addEventListener('click', function(event) {
        if (event.target === popup) { // Überprüfen, ob der Klick auf das Hintergrund-Div (nicht die Karte) war
            popup.style.display = 'none'; // Pop-up schließen
        }
    });
    showAbout(pokemonDetails);
}

function generatePopUpHeadHTML(pokemonDetails){
    return`
        <div class="pokemon-card-header">
            <div class="popup-header">
                <h2 id="popup-name">${pokemonDetails.name}</h2>
            </div>
            <img id="popup-image" src="${pokemonDetails.sprites.other['official-artwork'].front_default}" alt="${pokemonDetails.name}" alt="Pokemon Image">
            <div id="select-section">
                <button class="select-button" id="about">About</button>
                <button class="select-button" id="stats">Stats</button>
                <button class="select-button" id="evolution">EVO</button>
                <button class="select-button" id="more-info">More Info</button>
            </div>
        </div>
        <div id="pokemon-card-body" class="pokemon-card-body"></div>`
}
            
            // <span id="popup-id">#${pokemonDetails.id}</span>
function showAbout(pokemonDetails) {
    const cardBody = document.getElementById('pokemon-card-body');
    cardBody.innerHTML = `
        <div class="about-section">
            <h3>About ${pokemonDetails.name}</h3>
            <p>Type: ${pokemonDetails.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
            <p>Abilities: ${pokemonDetails.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ')}</p>
            <p>Weight: ${pokemonDetails.weight / 10} kg</p>
            <p>Height: ${pokemonDetails.height / 10} m</p>
            <p>Base Experience: ${pokemonDetails.base_experience}</p>
        </div>`;
}

function showStats(pokemonDetails) {
    const cardBody = document.getElementById('pokemon-card-body');
    cardBody.innerHTML = `
        <div class="stats-section">
            <h3>Stats of ${pokemonDetails.name}</h3>
            <ul>
                ${pokemonDetails.stats.map(statInfo => `
                    <li>${statInfo.stat.name}: ${statInfo.base_stat}</li>
                `).join('')}
            </ul>
        </div>`;
}
async function showEvolution(pokemonDetails) {
    const cardBody = document.getElementById('pokemon-card-body');
    const evolutionData = await getEvolutionData(pokemonDetails.species.url);

    cardBody.innerHTML = `
        <div class="evolution-section">
            <h3>Evolution Chain</h3>
            <div class="evolution-chain">${evolutionData ? evolutionData : 'No evolution data available'}</div>
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
        console.error('Error fetching evolution data:', error);
        return null;
    }
}

async function parseEvolutionChain(chain) {
    // Starte den rekursiven Prozess
    return await parseEvolutionChainRecursive(chain);
}

async function parseEvolutionChainRecursive(chain) {
    if (!chain) return '';

    // Füge das aktuelle Pokémon hinzu
    let evolutionChain = await getPokemonHTML(chain.species.url);

    // Überprüfe, ob es weitere Evolutionsstufen gibt und füge den Pfeil hinzu
    if (chain.evolves_to && chain.evolves_to.length > 0) {
        evolutionChain += `<img src="img/chevron_right.svg" alt="arrow" class="evolution-arrow">`;
        // Rekursiver Aufruf für die nächste Evolutionsstufe
        evolutionChain += await parseEvolutionChainRecursive(chain.evolves_to[0]);
    }

    return evolutionChain;
}

async function getPokemonHTML(speciesUrl) {
    try {
        // Extrahiere die Pokémon-ID aus der Spezies-URL
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();
        const pokemonId = speciesData.id;

        // Abrufen der Pokémon-Daten unter Verwendung der ID
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const pokemonData = await pokemonResponse.json();

        // Rückgabe der HTML-Struktur mit dem Bild und Namen des Pokémon
        return `
            <div class="evolution-pokemon">
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <p>${pokemonData.name}</p>
            </div>
        `;
    } catch (error) {
        console.error(`Error fetching Pokémon data:`, error);
        return `
            <div class="evolution-pokemon">
                <p>Image not available</p>
            </div>
        `;
    }
}


function showMoreInfo(pokemonDetails) {
    const cardBody = document.getElementById('pokemon-card-body');

    // Falls verfügbar, extrahiere die Daten
    const habitat = pokemonDetails.habitat ? pokemonDetails.habitat.name : "N/A";
    const forms = pokemonDetails.forms.map(form => form.name).join(', ');
    const moves = pokemonDetails.moves.map(move => move.move.name).join(', ');

    cardBody.innerHTML = `
        <div class="more-info-section">
            <h3>More Info</h3>
            <p>Habitat: ${habitat}</p>
            <p>Forms: ${forms}</p>
            <p>Moves: ${moves}</p>
        </div>
    `;
}

function resetTypeClasses(cardElement) {
    const typeClasses = [
        'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 
        'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 
        'steel', 'fairy'
    ];
    typeClasses.forEach(typeClass => cardElement.classList.remove(typeClass));
}
        
    
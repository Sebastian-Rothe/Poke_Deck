const POKE_BASE = "https://pokeapi.co/api/v2/";

const baseUrl = "https://pokeapi.co/api/v2/pokemon";
let offset = 0;
const limit = 24;

function init(){
    // loadFirstPoke();
    fetchPokemon(offset, limit);
    displayPokemon();
}

async function fetchPokemon(offset, limit){
    try {
        const response = await fetch(`${baseUrl}?offset=${offset}&limit=${limit}`);
        const data = await response.json();
        console.log(data.results);
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

async function displayPokemon(){
    const pokemonList = await fetchPokemon(offset, limit);
    const pokemonContainer = document.getElementById('pokemon-list');
 

    for (let i = 0; i < pokemonList.length; i++) {
        const pokemon = pokemonList[i];
        const pokemonDetails = await fetchPokemonDetails(pokemon.url);
        pokemonContainer.innerHTML += generateCardHTML(pokemon, i + offset, pokemonDetails);
    }

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

// async function loadFirstPoke(){
//     try {
//         let pokemonIndex = 1;
//         const response = await fetch(`${ONLOAD_POKE}${pokemonIndex}`);
//         for (let i = 1; i < 20; i++) {
//             const element = response[i];
//             pokemonIndex += 1;
            
//             console.log(element);
//         }
//     } catch (error) {
        
//     }
// }



// Event-Listener für den "Weitere laden" Button
document.getElementById('load-more').addEventListener('click', () => {
    offset += limit;
    displayPokemon();
});
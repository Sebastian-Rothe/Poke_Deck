// function generateCardHTML(pokemon, index, pokemonDetails) {
//     const types = pokemonDetails.types.map(typeInfo => typeInfo.type.name).join(', ');
//     return`
//         <div class="card">
//             <div class="headline">
//                 <h2 id="nameOfPokemon">${pokemon.name}</h2>
//                 <span class="indexDisplay">#${index + 1}</span>
//             </div>
//             <img class="alignPokeImg" src="${pokemonDetails.sprites.front_default}" alt="">
//             <div class="footerOfCard">
//             <div>${types}</div>
//             </div>
//         </div>
//         `
// }

function generateCardHTML(pokemonDetails) {
    const types = pokemonDetails.types.map(typeInfo => typeInfo.type.name).join(', ');
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
        <div class="headline">
            <h2 id="nameOfPokemon">${pokemonDetails.name}</h2>
            <span class="indexDisplay">#${pokemonDetails.id}</span>
        </div>
        <img src="${pokemonDetails.sprites.front_default}" alt="${pokemonDetails.name}">
        <div class="footerOfCard">
            <div>${types}</div>
        </div>
    `;

    return card;
}
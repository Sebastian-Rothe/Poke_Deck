
function generateCardHTML(pokemonDetails) {
    const types = pokemonDetails.types.map(typeInfo => typeInfo.type.name);
    const typeIcons = types.map(type => 
        `<div class="icon-container">
            <img src="/img/icons/${type}.svg" class="type-icon" alt="${type}">
        </div>`
    ).join(' ');

    const card = document.createElement('div');
    card.className = 'card pokemon-card';

    setPokemonTypeClass(card, pokemonDetails);

    card.innerHTML = `
        <div class="headline">
            <h2 id="nameOfPokemon">${pokemonDetails.name}</h2>
            <span class="indexDisplay">#${pokemonDetails.id}</span>
        </div>
        <img class="pokeImg" src="${pokemonDetails.sprites.other['official-artwork'].front_default}" alt="${pokemonDetails.name}">
        <div class="footerOfCard">
            <div>${typeIcons}</div>
        </div>
    `;

    return card;
}

function setPokemonTypeClass(cardElement, pokemonDetails) {
    const typeClass = `${pokemonDetails.types[0].type.name.toLowerCase()}`;
    cardElement.classList.add(typeClass);
}
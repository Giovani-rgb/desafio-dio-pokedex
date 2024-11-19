const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                        .map(type => `<li class="type ${type}">${type}</li>`)
                        .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join("");
        pokemonList.innerHTML += newHtml;
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

// Seleciona o container da lista de Pokémon
pokemonList.addEventListener("click", event => {
    // Verifica se o clique foi em um elemento com a classe 'pokemon'
    const pokemonItem = event.target.closest(".pokemon");

    if (pokemonItem) {
        const pokemonName = pokemonItem.querySelector(".name").textContent;

        // Faz a busca pelo Pokémon na API usando o nome ou número
        pokeApi.getPokemons().then(pokemons => {
            const selectedPokemon = pokemons.find(
                pokemon => pokemon.name === pokemonName
            );

            if (selectedPokemon) {
                showPokemonDetails(selectedPokemon);
            }
        });
    }
});

// Função para exibir os detalhes do Pokémon
function showPokemonDetails(pokemon) {
    const detailBox = document.createElement("div");
    detailBox.classList.add("pokemon-details");
    detailBox.innerHTML = `
        <div class="pokemon-info ${pokemon.type}">
            <h2>${pokemon.name} (#${pokemon.number})</h2>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
        </div>
        <div class="info-layout">
        <p>Type: ${pokemon.types.join(", ")}</p>
        <button class="close-btn">Close</button>
        </div>
        
    `;

    document.body.appendChild(detailBox);

    // Fecha a box ao clicar no botão
    const closeButton = detailBox.querySelector(".close-btn");
    closeButton.addEventListener("click", () => {
        document.body.removeChild(detailBox);
    });
}

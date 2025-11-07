const RandomTeam= [];

document.addEventListener('DOMContentLoaded', () => {
    const numCardsInput = document.getElementById('numCards');
    const startBtn = document.getElementById('startBtn');
    const cardsContainer = document.getElementById('cardsContainer');

    const typeSprites = {
        normal: 1, fighting: 2, flying: 3, poison: 4, ground: 5,
        rock: 6, bug: 7, ghost: 8, steel: 9, fire: 10, water: 11,
        grass: 12, electric: 13, psychic: 14, ice: 15, dragon: 16, dark: 17, fairy: 18
    };

    startBtn.addEventListener('click', async () => {
        const numCards = parseInt(numCardsInput.value);
        if (numCards < 1 || numCards > 50) {
            alert('Elige un número razonable.');
            return;
        }

        cardsContainer.innerHTML = '';
        downloadBtn.style.display = 'none';

        const ids = [];
        while (ids.length < numCards) {
            const id = Math.floor(Math.random() * 1025) + 1;
            if (!ids.includes(id)) ids.push(id);
        }

        for (let i = 0; i < numCards; i++) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back" id="card-${i}"></div>
                </div>
            `;
            cardsContainer.appendChild(card);

            card.addEventListener('click', async () => {
                if (!card.classList.contains('flipped')) {
                    const cardBack = document.getElementById(`card-${i}`);
                    const pokemon = await fetchPokemon(ids[i]);
                    cardBack.innerHTML = `
                        <div class="Name">${pokemon.name}</div>
                        <div class="Image"><img src="${pokemon.sprite}" alt="${pokemon.name}" crossorigin="anonymous"></div>
                        <div class="Stats">
                            <table class="stats-table">
                                <tr>
                                    <td width="50px">Hp</td>
                                    <td width="50px">${pokemon.stats.hp}</td>
                                    <td><div style="background-color: #FF0000; width: ${(pokemon.stats.hp / 255) * 100}%; height: 15px;"></div></td>
                                    </tr>
                                <tr>
                                    <td>Attack</td>
                                    <td>${pokemon.stats.attack}</td>
                                    <td><div  style="background-color: #FFA500; width: ${(pokemon.stats.attack / 255) * 100}%; height: 15px;"></div></td>
                                </tr>
                                <tr>
                                    <td>Defense</td>
                                    <td>${pokemon.stats.defense}</td>
                                    <td><div style="background-color: #0000FF; width: ${(pokemon.stats.defense / 255) * 100}%; height:15px;"></div></td>
                                </tr>
                                <tr>
                                    <td>Sp Atck.</td>
                                    <td>${pokemon.stats.specialAttack}</td>
                                    <td><div style="background-color: #800080; width: ${(pokemon.stats.specialAttack / 255) * 100}%; height:15px;"></div></td>
                                </tr>
                                <tr>
                                    <td>Sp Def.</td>
                                    <td>${pokemon.stats.specialDefense}</td>
                                    <td><div style="background-color: #00FF00; width: ${(pokemon.stats.specialDefense / 255) * 100}%; height: 15px;"></div></td>
                                </tr>
                                <tr>
                                    <td>Speed</td>
                                    <td>${pokemon.stats.speed}</td>
                                    <td><div style="background-color: #FFFF00; width: ${(pokemon.stats.speed / 255) * 100}%; height: 15px;"></div></td>
                                </tr>
                                <tr>
                                    <td>Total</td>
                                    <td colspan="2">${pokemon.stats.total}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="Ability">
                            ${pokemon.abilities.map(ability => `<div>${ability.name}</div>`).join('')}
                        </div>
                        <div class="Moves">
                            ${pokemon.moves.map(move => `
                                <table class="move-table">
                                    <tr class="move-cat">
                                        <td colspan="2">${move.name}</td>
                                        <td width=100px><img src="images/${move.category}.png" alt="${move.category}" crossorigin="anonymous" width="20px" height="20px"></td>
                                    </tr>
                                    <tr>
                                        <td>${move.power}</td>
                                        <td>${move.accuracy}</td>
                                        <td><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${typeSprites[move.type.toLowerCase()]}.png" alt="${move.type}" crossorigin="anonymous" width="100px" height="22px"></td>
                                    </tr>
                                </table>
                            `).join('')}
                        </div>
                        <div class="Types">
                            ${pokemon.types.map(type => `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/${typeSprites[type.toLowerCase()]}.png" alt="${type}" class="type-sprite" crossorigin="anonymous">`).join('')}
                        </div>
                    `;
                    card.classList.add('flipped');
                    const allCards = document.querySelectorAll('.card');
                    const flippedCards = document.querySelectorAll('.card.flipped');
                    if (flippedCards.length === allCards.length) {
                        downloadBtn.style.display = 'block';
                    }
                }
            });
        }
    });

    async function fetchPokemon(id) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();

            const stats = {
                hp: data.stats.find(s => s.stat.name === 'hp').base_stat,
                attack: data.stats.find(s => s.stat.name === 'attack').base_stat,
                defense: data.stats.find(s => s.stat.name === 'defense').base_stat,
                specialAttack: data.stats.find(s => s.stat.name === 'special-attack').base_stat,
                specialDefense: data.stats.find(s => s.stat.name === 'special-defense').base_stat,
                speed: data.stats.find(s => s.stat.name === 'speed').base_stat,
                total: data.stats.reduce((sum, s) => sum + s.base_stat, 0)
            };

            const types = data.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1));

            // Habilidades: Solo nombres, sin descripciones
            const abilityIds = [];
            while (abilityIds.length < 3) {
                const aid = Math.floor(Math.random() * 307) + 1;
                if (!abilityIds.includes(aid)) abilityIds.push(aid);
            }
            const abilities = [];
            const randomAbilities = [];
            for (const aid of abilityIds) {
                try {
                    const abRes = await fetch(`https://pokeapi.co/api/v2/ability/${aid}`);
                    const abData = await abRes.json();
                    abilities.push({ name: abData.name.charAt(0).toUpperCase() + abData.name.slice(1).replace(/-/g, ' ') });
                } catch {
                    abilities.push({ name: 'Error' });
                }
                randomAbilities.push(aid)
            }

            // Ataques: Con categoría, potencia, precisión, tipo
            const moveIds = [];
            while (moveIds.length < 10) {
                const mid = Math.floor(Math.random() * 919) + 1;
                if (!moveIds.includes(mid)) moveIds.push(mid);
            }
            const moves = [];
            const randomMoves = [];
            for (const mid of moveIds) {
                try {
                    const mvRes = await fetch(`https://pokeapi.co/api/v2/move/${mid}`);
                    const mvData = await mvRes.json();
                    const pName = mvData.name.split("-")
                    moves.push({
                        name: pName.length === 1
                        ? pName[0].charAt(0).toUpperCase() + pName[0].slice(1)
                        : pName[0].charAt(0).toUpperCase() + pName[0].slice(1) + " " + pName[1].replace(/-/g, ' '),
                        category: mvData.damage_class?.name.charAt(0).toUpperCase() + mvData.damage_class?.name.slice(1) || 'N/A',
                        power: mvData.power || 'N/A',
                        accuracy: mvData.accuracy || 'N/A',
                        type: mvData.type?.name.charAt(0).toUpperCase() + mvData.type?.name.slice(1) || 'N/A'
                    });
                    randomMoves.push(mid)
                } catch {
                    moves.push({ name: 'Error', category: 'N/A', power: 'N/A', accuracy: 'N/A', type: 'N/A' });
                }
            }
                RandomTeam.push({pokemon: id, abilities: randomAbilities, moves: randomMoves})
            return {
                name: data.name.replace("-"," "),
                sprite: data.sprites.other["official-artwork"]["front_default"],
                types,
                stats,
                abilities,
                moves
            };
        } catch (error) {
            console.error('Error fetching Pokémon:', error);
            return { name: 'Error', sprite: '', types: [], stats: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0, total: 0 }, abilities: [], moves: [] };
        }
    }
});
function TeamBuilder() {
    if (RandomTeam.length === 0) {
        alert('Agrega al menos un Pokémon antes de continuar.');
        return;
    }
    // Guarda la lista en localStorage como JSON
    localStorage.setItem('pokemonData', JSON.stringify(RandomTeam));
    // Navega a la página del armador
    window.location.href = 'builder.html';  // Asegúrate de que el archivo se llame así
}
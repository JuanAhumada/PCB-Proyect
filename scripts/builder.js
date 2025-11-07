// Recupera la lista de localStorage
const storedData = localStorage.getItem('pokemonData');
let pokemonData = [];
if (storedData) {
    pokemonData = JSON.parse(storedData);
} else {
    alert('No se encontró una lista de Pokémon. Regresa a la página de selección.');
}

const pokemonSelect = document.getElementById('pokemonSelect');
const abilitySelect = document.getElementById('abilitySelect');
const abilityDesc = document.getElementById('abilityDesc');
const movesList = document.getElementById('movesList');
const exportBtn = document.getElementById('exportBtn');
const exportArea = document.getElementById('export');

let selectedPokemon = null;
let selectedAbility = null;
let selectedMoves = [];

// Cargar Pokémon en el selector
async function loadPokemons() {
    for (const data of pokemonData) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.pokemon}`);
        const pokemon = await response.json();
        const option = document.createElement('option');
        option.value = JSON.stringify(data);
        option.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        pokemonSelect.appendChild(option);
    }
}

// Evento al seleccionar Pokémon
pokemonSelect.addEventListener('change', async (e) => {
    if (!e.target.value) {
        document.getElementById('pokemonImage').classList.add('hidden');
        return;
    }
    const data = JSON.parse(e.target.value);
    selectedPokemon = data;
    selectedAbility = null;
    selectedMoves = [];

    // Mostrar imagen del Pokémon
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.pokemon}`);
    const pokemon = await response.json();
    document.getElementById('pokemonImg').src = pokemon.sprites.other["official-artwork"]["front_default"];
    document.getElementById('pokemonImage').classList.remove('hidden');

    // Cargar habilidades
    abilitySelect.innerHTML = '<option value="">-- Elige una Habilidad --</option>';
    for (const abilityId of data.abilities) {
        const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityId}`);
        const ability = await response.json();
        const option = document.createElement('option');
        option.value = `${abilityId}|${ability.name}`;
        option.textContent = ability.name.charAt(0).toUpperCase() + ability.name.slice(1);
        abilitySelect.appendChild(option);
    }
    document.getElementById('abilitiesSection').classList.remove('hidden');

    // Cargar movimientos como botones
    movesList.innerHTML = '';
    for (const moveId of data.moves) {
        const response = await fetch(`https://pokeapi.co/api/v2/move/${moveId}`);
        const move = await response.json();
        const button = document.createElement('button');
        button.className = 'move-btn';
        button.textContent = move.name.charAt(0).toUpperCase() + move.name.slice(1);
        button.addEventListener('click', () => {
            if (selectedMoves.includes(move.name)) {
                // Deseleccionar
                selectedMoves = selectedMoves.filter(m => m !== move.name);
                button.classList.remove('selected');
            } else if (selectedMoves.length < 4) {
                // Seleccionar
                selectedMoves.push(move.name);
                button.classList.add('selected');
            } else {
                alert('Solo puedes seleccionar 4 movimientos.');
            }
        });
        movesList.appendChild(button);
    }
    document.getElementById('movesSection').classList.remove('hidden');
});

// Mostrar descripción de habilidad
abilitySelect.addEventListener('change', async (e) => {
    if (!e.target.value) {
        abilityDesc.textContent = 'Selecciona una habilidad para ver su descripción.';
        selectedAbility = null;
        return;
    }
    const [abilityId, abilityName] = e.target.value.split('|');
    selectedAbility = abilityName;
    const response = await fetch(`https://pokeapi.co/api/v2/ability/${abilityId}`);
    const ability = await response.json();
    const desc = ability.effect_entries.find(entry => entry.language.name === 'en')?.effect || 'Descripción no disponible';
    abilityDesc.textContent = desc;
});

// Exportar
exportBtn.addEventListener('click', () => {
    if (!selectedPokemon || !selectedAbility || selectedMoves.length !== 4) {
        alert('Selecciona Pokémon, habilidad y exactamente 4 movimientos.');
        return;
    }
    const teraType = document.getElementById('teraTypeSelect').value;
    const pokemonName = pokemonSelect.options[pokemonSelect.selectedIndex].textContent;
    const exportText = `${pokemonName}\nAbility: ${selectedAbility}\nTera Type: ${teraType}\n- ${selectedMoves[0]}\n- ${selectedMoves[1]}\n- ${selectedMoves[2]}\n- ${selectedMoves[3]}`;
    exportArea.textContent = exportText;
});

// Inicializar
loadPokemons();
function searchCharacters() {
    const characterName = document.getElementById('characterName').value.trim();
    const characterListDiv = document.getElementById('characterList');

    // Limpar resultados anteriores
    characterListDiv.innerHTML = '';

    // Verificar se o nome do personagem foi inserido
    if (!characterName) {
        characterListDiv.innerHTML = '<p>Please enter a character name.</p>';
        return;
    }

    // Definir as URLs base das APIs selecionadas
    const apiUrls = {
        rickAndMorty: `https://rickandmortyapi.com/api/character/?name=${characterName}`,
        starWars: `https://swapi.dev/api/people/?search=${characterName}`,
        pokemon: `https://pokeapi.co/api/v2/pokemon/${characterName.toLowerCase()}`
    };



    // Array para armazenar todas as promessas de fetch
    const fetchPromises = [];

    // Fazer uma requisição para cada API e armazenar as promessas no array
    for (const api in apiUrls) {
        const url = apiUrls[api];
        fetchPromises.push(
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    // Processar os resultados de cada API
                    switch (api) {
                        case 'rickAndMorty':
                            return data.results.map(character => ({
                                name: character.name,
                                image: character.image,
                                source: 'Rick and Morty'
                            }));
                        case 'starWars':
                            return data.results.map(character => ({
                                name: character.name,
                                image: `https://starwars-visualguide.com/assets/img/characters/${character.url.match(/\d+/)}.jpg`,
                                source: 'Star Wars'
                            }));
                        case 'pokemon':
                            return {
                                name: data.name,
                                image: data.sprites.front_default,
                                source: 'Pokemon'
                            };
                        default:
                            return [];
                    }
                })
                .catch(error => {
                    console.error(`Error fetching ${api} data:`, error);
                    return [];
                })
        );
    }

    // Aguardar todas as promessas de fetch serem resolvidas
    Promise.all(fetchPromises)
        .then(results => {
            // Concatenar os resultados de todas as APIs em um único array
            const combinedResults = results.flat();

            // Verificar se algum resultado foi encontrado
            if (combinedResults.length === 0) {
                characterListDiv.innerHTML = '<p>No characters found.</p>';
                return;
            }

            // Mostrar os resultados combinados na página
            combinedResults.forEach(item => {
                const card = `
                    <div class="character-card">
                        <h2>${item.name} (${item.source})</h2>
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                `;
                characterListDiv.innerHTML += card;
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            characterListDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.querySelector('#themeSwitch');

    function switchTheme(e) {
        if (e.target.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    toggleSwitch.addEventListener('change', switchTheme, false);
});


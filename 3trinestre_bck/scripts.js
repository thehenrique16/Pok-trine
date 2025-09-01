const container = document.getElementById("pokedex-container");
const searchInput = document.getElementById("search");

/* Mapa de Pokémon -> Treinadores */
const trainerMap = {
  pikachu: [{ name: "Ash", img: "https://static.wikia.nocookie.net/pokemon/images/0/0b/Ash_SM.png" }],
  bulbasaur: [{ name: "Ash", img: "https://static.wikia.nocookie.net/pokemon/images/0/0b/Ash_SM.png" }],
  squirtle: [
    { name: "Ash", img: "https://static.wikia.nocookie.net/pokemon/images/0/0b/Ash_SM.png" },
    { name: "Misty", img: "https://static.wikia.nocookie.net/pokemon/images/0/05/Misty_SM.png" }
  ],
  charmander: [{ name: "Ash", img: "https://static.wikia.nocookie.net/pokemon/images/0/0b/Ash_SM.png" }],
  starmie: [{ name: "Misty", img: "https://static.wikia.nocookie.net/pokemon/images/0/05/Misty_SM.png" }],
  onix: [{ name: "Brock", img: "https://static.wikia.nocookie.net/pokemon/images/f/fb/Brock_SM.png" }],
  psyduck: [{ name: "Misty", img: "https://static.wikia.nocookie.net/pokemon/images/0/05/Misty_SM.png" }]
};

async function fetchPokemons() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=200");
  const data = await response.json();

  const pokemons = await Promise.all(
    data.results.map(async (p) => {
      const res = await fetch(p.url);
      const details = await res.json();
      return {
        id: details.id,
        name: details.name,
        type: details.types.map(t => t.type.name).join("/"),
        img: details.sprites.other["official-artwork"].front_default || details.sprites.front_default,
        height: details.height / 10 + " m",
        weight: details.weight / 10 + " kg",
        abilities: details.abilities.map(a => a.ability.name).join(", "),
        trainers: trainerMap[details.name] || []
      };
    })
  );

  renderPokemons(pokemons);

  searchInput.addEventListener("input", () => {
    const filtered = pokemons.filter(p =>
      p.name.toLowerCase().includes(searchInput.value.toLowerCase())
    );
    renderPokemons(filtered);
  });
}

function renderPokemons(list) {
  container.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.innerHTML = `
      <div class="pokemon-card-inner">
        <div class="pokemon-card-front">
          <img src="${p.img}" alt="${p.name}">
          <h3>${p.name}</h3>
        </div>
        <div class="pokemon-card-back">
          <h3>${p.name}</h3>
          <p><strong>Tipo:</strong> ${p.type}</p>
          <p><strong>Altura:</strong> ${p.height}</p>
          <p><strong>Peso:</strong> ${p.weight}</p>
          <p><strong>Habilidades:</strong> ${p.abilities}</p>
          ${
            p.trainers.length > 0
              ? `<div class="trainers">
                  <span>Utilizado por:</span>
                  ${p.trainers.map(tr => `<img src="${tr.img}" title="${tr.name}">`).join("")}
                </div>`
              : ""
          }
        </div>
      </div>
    `;

    // Clique para virar
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });

    container.appendChild(card);
  });
}

/* Navbar smooth scroll */
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    document.getElementById(targetId).scrollIntoView({ behavior: "smooth" });
  });
});

fetchPokemons();

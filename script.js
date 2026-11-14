
const games = [
  { name: "Your First Game", category: "Arcade", symbol: "01", description: "Add your game here.", url: "", glow: "#2868b7" },
  { name: "Puzzle Challenge", category: "Puzzle", symbol: "?", description: "Add a puzzle game.", url: "", glow: "#7250b8" },
  { name: "Sports Zone", category: "Sports", symbol: "★", description: "Add a sports game.", url: "", glow: "#167d70" }
];

const $ = id => document.getElementById(id);

const gamesPage = $("gamesPage");
const tiktokPage = $("tiktokPage");
const gamesTab = $("gamesTab");
const tiktokTab = $("tiktokTab");

function showPage(page) {
  const isTikTok = page === "tiktok";
  gamesPage.hidden = isTikTok;
  tiktokPage.hidden = !isTikTok;
  gamesTab.classList.toggle("active", !isTikTok);
  tiktokTab.classList.toggle("active", isTikTok);
  window.scrollTo(0, 0);
}

gamesTab.addEventListener("click", () => showPage("games"));
tiktokTab.addEventListener("click", () => showPage("tiktok"));
$("homeLink").addEventListener("click", e => {
  e.preventDefault();
  showPage("games");
});

// Game library
const grid = $("gameGrid");
const searchInput = $("searchInput");
const count = $("gameCount");
const empty = $("emptyState");
let activeCategory = "All";

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c =>
    ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]
  );
}

function renderGames() {
  const term = searchInput.value.trim().toLowerCase();
  const visible = games.filter(game =>
    (activeCategory === "All" || game.category === activeCategory) &&
    (game.name.toLowerCase().includes(term) ||
     game.description.toLowerCase().includes(term))
  );

  count.textContent = `${visible.length} GAMES`;
  empty.hidden = visible.length !== 0;

  grid.innerHTML = visible.map(game => `
    <article class="game-card">
      <div class="art" style="--glow:${escapeHTML(game.glow)}">
        <span>${escapeHTML(game.symbol)}</span>
      </div>
      <div class="card-info">
        <h3>${escapeHTML(game.name)}</h3>
        <p>${escapeHTML(game.description)}</p>
        <a class="play" href="${game.url || "#"}">OPEN GAME</a>
      </div>
    </article>
  `).join("");
}

searchInput.addEventListener("input", renderGames);

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".filter.active")?.classList.remove("active");
    button.classList.add("active");
    activeCategory = button.dataset.category;
    renderGames();
  });
});

// TikTok video embed
$("tiktokForm").addEventListener("submit", event => {
  event.preventDefault();

  const url = $("tiktokUrl").value.trim();
  const match = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/i);

  if (!match) {
    alert("Enter a valid public TikTok video link.");
    return;
  }

  const result = $("tiktokResult");
  result.innerHTML = `
    <blockquote class="tiktok-embed"
      cite="${escapeHTML(url)}"
      data-video-id="${match[1]}"
      style="max-width:605px;min-width:250px">
    </blockquote>`;

  const script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js";
  script.async = true;
  result.appendChild(script);
});

renderGames();

// Add games you created, have permission to use, or that provide an official link/embed.
const games = [
  { name: "Your First Game", category: "Arcade", symbol: "01", description: "Replace this sample with a game you are allowed to share.", url: "", glow: "#2868b7" },
  { name: "Puzzle Challenge", category: "Puzzle", symbol: "?", description: "Add a puzzle game link or your own game file.", url: "", glow: "#7250b8" },
  { name: "Sports Zone", category: "Sports", symbol: "★", description: "Add a sports game link or your own game file.", url: "", glow: "#167d70" }
];

const grid = document.getElementById("gameGrid");
const searchInput = document.getElementById("searchInput");
const count = document.getElementById("gameCount");
const empty = document.getElementById("emptyState");
let activeCategory = "All";

function renderGames() {
  const term = searchInput.value.trim().toLowerCase();
  const visible = games.filter(game =>
    (activeCategory === "All" || game.category === activeCategory) &&
    (game.name.toLowerCase().includes(term) || game.description.toLowerCase().includes(term))
  );
  count.textContent = `${visible.length} GAME${visible.length === 1 ? "" : "S"}`;
  empty.hidden = visible.length !== 0;
  grid.innerHTML = visible.map(game => `
    <article class="game-card">
      <div class="art" style="--glow:${escapeHTML(game.glow)}"><span>${escapeHTML(game.symbol)}</span></div>
      <div class="card-info">
        <div class="card-top"><h3>${escapeHTML(game.name)}</h3><span class="tag">${escapeHTML(game.category)}</span></div>
        <p>${escapeHTML(game.description)}</p>
        <a class="play" href="${game.url ? escapeHTML(game.url) : "#"}"
           ${game.url ? 'target="_blank" rel="noopener noreferrer"' : 'aria-disabled="true" onclick="event.preventDefault(); alert(\'Add a game URL in script.js first.\')"'}>
          ${game.url ? "OPEN GAME ↗" : "ADD GAME LINK"}
        </a>
      </div>
    </article>`).join("");
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
}
searchInput.addEventListener("input", renderGames);
document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
  document.querySelector(".filter.active")?.classList.remove("active");
  button.classList.add("active"); activeCategory = button.dataset.category; renderGames();
}));

const gamesPage = document.getElementById("gamesPage");
const tiktokPage = document.getElementById("tiktokPage");
const gamesTab = document.getElementById("gamesTab");
const tiktokTab = document.getElementById("tiktokTab");
function showPage(page) {
  const showTikTok = page === "tiktok";
  gamesPage.hidden = showTikTok; tiktokPage.hidden = !showTikTok;
  gamesTab.onclick = () => showPage("games");
tiktokTab.onclick = () => showPage("tiktok");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
gamesTab.addEventListener("click", () => showPage("games"));
tiktokTab.addEventListener("click", () => showPage("tiktok"));
document.getElementById("homeLink").addEventListener("click", event => { event.preventDefault(); showPage("games"); });

document.getElementById("tiktokForm").addEventListener("submit", event => {
  event.preventDefault();
  const raw = document.getElementById("tiktokUrl").value.trim();
  let url;
  try { url = new URL(raw); } catch { alert("Enter a valid TikTok video URL."); return; }
  if (!/(^|\.)tiktok\.com$/i.test(url.hostname) || !url.pathname.includes("/video/")) {
    alert("Please enter a public TikTok video link, not just a profile link."); return;
  }
  const match = url.pathname.match(/\/video\/(\d+)/);
  if (!match) { alert("I couldn't find a video ID in that link."); return; }
  const result = document.getElementById("tiktokResult");
  result.innerHTML = `<blockquote class="tiktok-embed" cite="${url.href}" data-video-id="${match[1]}" style="max-width:605px;min-width:250px"><section><a href="${url.href}" target="_blank" rel="noopener noreferrer">View this TikTok on TikTok</a></section></blockquote>`;
  const oldScript = document.getElementById("tiktokEmbedScript");
  if (oldScript) oldScript.remove();
  const script = document.createElement("script");
  script.id = "tiktokEmbedScript"; script.src = "https://www.tiktok.com/embed.js"; script.async = true;
  result.appendChild(script);
});
document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault(); searchInput.focus();
  }
});
renderGames();

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const { projects = [], certs = [] } = window.SITE_DATA || {};

const projectGrid = document.getElementById("projectGrid");
const certList = document.getElementById("certList");
const certSearch = document.getElementById("certSearch");
const certCategory = document.getElementById("certCategory");

function projectCard(p){
  const tools = (p.tools && p.tools.length) ? `• Tools: ${p.tools.join(", ")}` : "";
  const links = (p.links || [])
    .map(l => `<a class="btn secondary small" href="${l.url}" target="_blank" rel="noreferrer">${l.label}</a>`)
    .join(" ");

  return `
    <article class="card list-item" data-tag="${p.tag}">
      <h3>${p.title}</h3>
      <div class="meta">${p.when || ""} ${tools}</div>
      <p class="muted"><strong>Problem:</strong> ${p.problem || ""}</p>
      <p class="muted"><strong>Action:</strong> ${p.action || ""}</p>
      <p class="muted"><strong>Result:</strong> ${p.result || ""}</p>
      ${links ? `<div class="hero-actions">${links}</div>` : ""}
    </article>
  `;
}

function renderProjects(filter = "all"){
  if (!projectGrid) return;
  const filtered = (filter === "all") ? projects : projects.filter(p => p.tag === filter);
  projectGrid.innerHTML = filtered.map(projectCard).join("");
}

function certItem(c){
  const date = c.date ? ` • ${c.date}` : "";
  const url = c.url ? `<a class="btn secondary small" href="${c.url}" target="_blank" rel="noreferrer">Credential</a>` : "";
  return `
    <div class="card list-item">
      <strong>${c.name}</strong>
      <div class="meta">${c.issuer || "Issuer"}${date}</div>
      ${url}
    </div>
  `;
}

function renderCerts(){
  if (!certList) return;

  const q = (certSearch?.value || "").toLowerCase().trim();
  const cat = certCategory?.value || "all";

  const filtered = certs.filter(c => {
    const matchesText =
      !q ||
      (c.name || "").toLowerCase().includes(q) ||
      (c.issuer || "").toLowerCase().includes(q);

    const matchesCat = (cat === "all") ? true : c.category === cat;
    return matchesText && matchesCat;
  });

  certList.innerHTML = filtered.map(certItem).join("");
}

document.querySelectorAll("[data-filter]").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    renderProjects(btn.dataset.filter);
  });
});

certSearch?.addEventListener("input", renderCerts);
certCategory?.addEventListener("change", renderCerts);

renderProjects("all");
renderCerts();

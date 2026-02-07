const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const data = window.SITE_DATA || { projects: [], certs: [] };
const projects = Array.isArray(data.projects) ? data.projects : [];
const certs = Array.isArray(data.certs) ? data.certs : [];

const projectGrid = document.getElementById("projectGrid");
const certList = document.getElementById("certList");
const certSearch = document.getElementById("certSearch");
const certCategory = document.getElementById("certCategory");

function renderProjects(filter = "all") {
  if (!projectGrid) return;
  const filtered = filter === "all" ? projects : projects.filter(p => p.tag === filter);

  projectGrid.innerHTML = filtered.map(p => `
    <article class="card list-item">
      <h3>${p.title}</h3>
      <div class="meta">${p.when || ""}${p.tools?.length ? ` • Tools: ${p.tools.join(", ")}` : ""}</div>
      <p class="muted"><strong>Problem:</strong> ${p.problem || ""}</p>
      <p class="muted"><strong>Action:</strong> ${p.action || ""}</p>
      <p class="muted"><strong>Result:</strong> ${p.result || ""}</p>
    </article>
  `).join("");
}

function renderCerts() {
  if (!certList) return;

  const q = (certSearch?.value || "").toLowerCase().trim();
  const cat = certCategory?.value || "all";

  const filtered = certs.filter(c => {
    const matchesText =
      !q ||
      (c.name || "").toLowerCase().includes(q) ||
      (c.issuer || "").toLowerCase().includes(q);

    const matchesCat = cat === "all" ? true : c.category === cat;
    return matchesText && matchesCat;
  });

  certList.innerHTML = filtered.map(c => {
    const date = c.date ? ` • ${c.date}` : "";
    const link = c.url ? `<a class="btn secondary small" href="${c.url}" target="_blank" rel="noreferrer">Credential</a>` : "";
    return `
      <div class="card list-item">
        <strong>${c.name}</strong>
        <div class="meta">${c.issuer || "Issuer"}${date}</div>
        ${link}
      </div>
    `;
  }).join("");
}

// Filters
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

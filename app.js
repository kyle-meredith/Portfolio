(function () {
  function init() {
    const data = window.SITE_DATA || { projects: [], certs: [] };
    const projects = Array.isArray(data.projects) ? data.projects : [];
    const certs = Array.isArray(data.certs) ? data.certs : [];

    const projectGrid = document.getElementById("projectGrid");
    const certList = document.getElementById("certList"); // tbody
    const certSearch = document.getElementById("certSearch");
    const certCategory = document.getElementById("certCategory");

    // Visible debug so we KNOW JS is running and data loaded
    const debugEl = document.getElementById("debug");
    if (debugEl) debugEl.textContent = `Loaded: ${projects.length} projects, ${certs.length} certs`;

    // Footer year (if present)
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // --- Projects (render first; cert errors won't block this) ---
    function renderProjects(filter = "all") {
      if (!projectGrid) return;

      const filtered =
        filter === "all"
          ? projects
          : projects.filter(p => (p.tag || "").toLowerCase() === filter);

      projectGrid.innerHTML = filtered.map(p => `
        <article class="card list-item">
          <h3>${p.title || "Untitled"}</h3>
          <div class="meta">
            ${p.when || ""}
            ${p.tools?.length ? ` • Tools: ${p.tools.join(", ")}` : ""}
          </div>
          <p class="muted"><strong>Problem:</strong> ${p.problem || ""}</p>
          <p class="muted"><strong>Action:</strong> ${p.action || ""}</p>
          <p class="muted"><strong>Result:</strong> ${p.result || ""}</p>
        </article>
      `).join("");
    }

    document.querySelectorAll("[data-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".chip").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        renderProjects(btn.dataset.filter);
      });
    });

    renderProjects("all");

    // --- Certifications (table rows) ---
    function renderCerts() {
      if (!certList) return;

      const q = (certSearch?.value || "").toLowerCase().trim();
      const cat = (certCategory?.value || "all").toLowerCase();

      const labelMap = { ld: "L&D", crm: "CRM", it: "IT", tools: "Tools", compliance: "Compliance" };

      const filtered = certs.filter(c => {
        const matchesText =
          !q ||
          (c.name || "").toLowerCase().includes(q) ||
          (c.issuer || "").toLowerCase().includes(q);

        const matchesCat = cat === "all" ? true : (c.category || "").toLowerCase() === cat;
        return matchesText && matchesCat;
      });

      certList.innerHTML = filtered.map(c => {
        const categoryLabel = labelMap[c.category] || c.category || "—";
        const date = c.date || "—";
        const link = c.url
          ? `<a class="btn secondary small" href="${c.url}" target="_blank" rel="noreferrer">View</a>`
          : `<span class="muted">—</span>`;

        return `
          <tr>
            <td><strong>${c.name || "—"}</strong></td>
            <td>${c.issuer || "—"}</td>
            <td><span class="cert-badge">${categoryLabel}</span></td>
            <td>${date}</td>
            <td>${link}</td>
          </tr>
        `;
      }).join("");
    }

    certSearch?.addEventListener("input", renderCerts);
    certCategory?.addEventListener("change", renderCerts);
    renderCerts();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

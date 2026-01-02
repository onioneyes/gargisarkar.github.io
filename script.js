/* =========================================================
   CORE UTILITIES (SAFE & EXPLICIT)
   ========================================================= */

const qs  = (s) => document.querySelector(s);
const qsa = (s) => document.querySelectorAll(s);

const create = (tag, cls = null) => {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  return el;
};

const normalizeYear = (y) =>
  typeof y === "number" ? y : 0;

/* =========================================================
   BOOTSTRAP
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  fetch("index.json")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load index.json");
      return res.json();
    })
    .then(data => init(data))
    .catch(err => {
      console.error(err);
      alert("Data failed to load. Check console.");
    });
});

/* =========================================================
   INIT
   ========================================================= */

function init(data) {
  renderHero(data.about);
  renderNavigation(data.navigation);

  renderAnnouncementsFromPublications(data.publications);

  renderExperience(data.experience);
  renderEducation(data.education);
  renderPublications(data.publications);
  renderResearch(data.research);
  renderProjects(data.projects);
  renderAcademicService(data.academic_service);
  renderSimpleList("teaching", data.teaching);
  renderSimpleList("achievements", data.achievements);
  renderSimpleList("talks_and_presentations", data.talks_and_presentations);
  renderSimpleList("activities", data.activities);
  renderSkills(data.technical_skills);
  renderReferences(data.references);

  setupScrollReveal();
  setupNavHighlight();
}

/* =========================================================
   HERO
   ========================================================= */

function renderHero(about) {
  qs("#name").textContent = about.name;
  qs("#title").textContent = about.title;
  qs("#affiliation").innerHTML = about.affiliation.join("<br>");
  qs("#email").textContent = about.email;
  qs("#email").href = `mailto:${about.email}`;
  qs("#photo").src = about.photo.src;
  qs("#photo").alt = about.photo.alt || about.name;
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function renderNavigation(nav) {
  const navEl = qs("#top-nav");
  nav.forEach(id => {
    const a = create("a");
    a.href = `#${id}`;
    a.textContent = id.replace(/_/g, " ").toUpperCase();
    navEl.appendChild(a);
  });
}

/* =========================================================
   ANNOUNCEMENTS (DERIVED, NOT MAGIC)
   ========================================================= */

function renderAnnouncementsFromPublications(pubs) {
  const container = qs("#announcements");

  const merged = [
    ...pubs.journals,
    ...pubs.conference_proceedings
  ].sort((a, b) => normalizeYear(b.year) - normalizeYear(a.year))
   .slice(0, 5);

  merged.forEach(p => {
    const card = create("div", "announce");
    card.setAttribute("data-reveal", "");
    card.innerHTML = `
      <strong>${p.title}</strong><br>
      <small>${p.venue} (${p.year})</small>
    `;
    container.appendChild(card);
  });
}

/* =========================================================
   CARD RENDERER (REUSABLE, CLEAN)
   ========================================================= */

function addCard(sectionId, html) {
  const container = qs(`#${sectionId}`);
  const card = create("div", "card");
  card.setAttribute("data-reveal", "");
  card.innerHTML = html;
  container.appendChild(card);
}

/* =========================================================
   EXPERIENCE
   ========================================================= */

function renderExperience(arr) {
  arr.forEach(e =>
    addCard("experience", `
      <strong>${e.role}</strong><br>
      ${e.institution}, ${e.location}<br>
      <small>${e.period}</small>
    `)
  );
}

/* =========================================================
   EDUCATION
   ========================================================= */

function renderEducation(arr) {
  arr.forEach(e =>
    addCard("education", `
      <strong>${e.degree}</strong><br>
      ${e.institution}<br>
      <small>${e.period || e.year}</small>
    `)
  );
}

/* =========================================================
   PUBLICATIONS
   ========================================================= */

function renderPublications(pubs) {
  const sec = qs("#publications");

  const hJ = create("h3"); hJ.textContent = "Journals";
  sec.appendChild(hJ);

  pubs.journals
    .sort((a,b) => normalizeYear(b.year) - normalizeYear(a.year))
    .forEach(p =>
      addCard("publications", `
        <strong>${p.title}</strong><br>
        ${p.authors.join(", ")}<br>
        <em>${p.venue}</em> (${p.year})
      `)
    );

  const hC = create("h3"); hC.textContent = "Conference Proceedings";
  sec.appendChild(hC);

  pubs.conference_proceedings.forEach(p =>
    addCard("publications", `
      <strong>${p.title}</strong><br>
      ${p.authors.join(", ")}<br>
      <em>${p.venue}</em> (${p.year})
    `)
  );
}

/* =========================================================
   RESEARCH / PROJECTS / SERVICE
   ========================================================= */

function renderResearch(arr) {
  arr.forEach(r =>
    addCard("research", `
      <strong>${r.title}</strong>
      <ul>${r.details.map(d => `<li>${d}</li>`).join("")}</ul>
    `)
  );
}

function renderProjects(arr) {
  arr.forEach(p =>
    addCard("projects", `
      <strong>${p.title}</strong>
      <ul>${p.details.map(d => `<li>${d}</li>`).join("")}</ul>
    `)
  );
}

function renderAcademicService(obj) {
  Object.entries(obj).forEach(([k, v]) =>
    addCard("academic_service", `
      <strong>${k.replace(/_/g," ")}</strong>
      <ul>${v.map(x => `<li>${x}</li>`).join("")}</ul>
    `)
  );
}

/* =========================================================
   SIMPLE LIST SECTIONS
   ========================================================= */

function renderSimpleList(id, arr) {
  arr.forEach(item =>
    addCard(id, typeof item === "string" ? item : JSON.stringify(item))
  );
}

/* =========================================================
   SKILLS
   ========================================================= */

function renderSkills(arr) {
  const sec = qs("#technical_skills");
  arr.forEach(skill => {
    const s = create("span", "skill");
    s.setAttribute("data-reveal", "");
    s.textContent = skill;
    sec.appendChild(s);
  });
}

/* =========================================================
   REFERENCES
   ========================================================= */

function renderReferences(arr) {
  arr.forEach(r =>
    addCard("references", `
      <strong>${r.name}</strong><br>
      ${r.designation}, ${r.institution}<br>
      ${r.email}
    `)
  );
}

/* =========================================================
   SCROLL REVEAL (STRONG, MODERN)
   ========================================================= */

function setupScrollReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.15 }
  );

  qsa("[data-reveal]").forEach(el => observer.observe(el));
}

/* =========================================================
   NAV ACTIVE STATE
   ========================================================= */

function setupNavHighlight() {
  const sections = qsa("section");
  const links = qsa("#top-nav a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 140) {
        current = sec.id;
      }
    });

    links.forEach(a =>
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`)
    );
  });
}

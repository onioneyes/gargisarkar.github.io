console.log("✅ script.js loaded");

/* =========================
   SAFE HELPERS
========================= */
const qs = (s) => document.querySelector(s);
const safe = (el, fn) => { if (el) fn(el); };

fetch("index.json")
  .then(r => {
    if (!r.ok) throw new Error("index.json not found");
    return r.json();
  })
  .then(data => {
    console.log("✅ JSON loaded");

    renderAbout(data.about);
    renderExperience(data.experience);
    renderEducation(data.education);
    renderPublications(data.publications);
    renderResearch(data.research);
    renderProjects(data.projects);
    renderAcademicService(data.academic_service);
    renderList("teaching", data.teaching);
    renderList("achievements", data.achievements);
    renderList("talks_and_presentations", data.talks_and_presentations);
    renderList("activities", data.activities);
    renderSkills(data.technical_skills);
    renderReferences(data.references);
  })
  .catch(err => console.error("❌ JS failed:", err));

/* =========================
   ABOUT / HERO
========================= */
function renderAbout(a) {
  safe(qs("#name"), el => el.textContent = a.name);
  safe(qs("#title"), el => el.textContent = a.title);
  safe(qs("#photo"), el => el.src = a.photo?.src || "");
  safe(qs("#email"), el => {
    el.textContent = a.email;
    el.href = `mailto:${a.email}`;
  });
}

/* =========================
   EXPERIENCE
========================= */
function renderExperience(arr = []) {
  const c = qs("#experience");
  if (!c) return;

  arr.forEach(e => {
    const d = document.createElement("div");
    d.className = "card";
    d.innerHTML = `
      <strong>${e.role}</strong><br>
      ${e.institution}<br>
      <small>${e.period}</small>
    `;
    c.appendChild(d);
  });
}

/* =========================
   EDUCATION
========================= */
function renderEducation(arr = []) {
  const c = qs("#education");
  if (!c) return;

  arr.forEach(e => {
    const d = document.createElement("div");
    d.className = "card";
    d.innerHTML = `
      <strong>${e.degree}</strong><br>
      ${e.institution}<br>
      <small>${e.period || e.year}</small>
    `;
    c.appendChild(d);
  });
}

/* =========================
   PUBLICATIONS
========================= */
function renderPublications(pubs) {
  const c = qs("#publications");
  if (!c || !pubs) return;

  pubs.journals?.forEach(p => addPub(c, p));
  pubs.conference_proceedings?.forEach(p => addPub(c, p));
}

function addPub(c, p) {
  const d = document.createElement("div");
  d.className = "card";
  d.innerHTML = `
    <strong>${p.title}</strong><br>
    ${p.authors.join(", ")}<br>
    <em>${p.venue}</em> (${p.year})
  `;
  c.appendChild(d);
}

/* =========================
   RESEARCH / PROJECTS
========================= */
function renderResearch(arr = []) {
  renderTitledList("#research", arr);
}

function renderProjects(arr = []) {
  renderTitledList("#projects", arr);
}

function renderTitledList(id, arr) {
  const c = qs(id);
  if (!c) return;

  arr.forEach(r => {
    const d = document.createElement("div");
    d.className = "card";
    d.innerHTML = `
      <strong>${r.title}</strong>
      <ul>${r.details.map(x => `<li>${x}</li>`).join("")}</ul>
    `;
    c.appendChild(d);
  });
}

/* =========================
   ACADEMIC SERVICE
========================= */
function renderAcademicService(obj = {}) {
  const c = qs("#academic_service");
  if (!c) return;

  Object.entries(obj).forEach(([k, v]) => {
    const d = document.createElement("div");
    d.className = "card";
    d.innerHTML = `
      <strong>${k.replace(/_/g," ")}</strong>
      <ul>${v.map(x => `<li>${x}</li>`).join("")}</ul>
    `;
    c.appendChild(d);
  });
}

/* =========================
   SIMPLE LIST SECTIONS
========================= */
function renderList(id, arr = []) {
  const c = qs(`#${id}`);
  if (!c) return;

  arr.forEach(item => {
    const d = document.createElement("div");
    d.className = "card";
    d.textContent = item;
    c.appendChild(d);
  });
}

/* =========================
   SKILLS
========================= */
function renderSkills(arr = []) {
  const c = qs("#technical_skills");
  if (!c) return;

  arr.forEach(skill => {
    const s = document.createElement("span");
    s.className = "skill";
    s.textContent = skill;
    c.appendChild(s);
  });
}

/* =========================
   REFERENCES
========================= */
function renderReferences(arr = []) {
  const c = qs("#references");
  if (!c) return;

  arr.forEach(r => {
    const d = document.createElement("div");
    d.className = "card";
    d.innerHTML = `
      <strong>${r.name}</strong><br>
      ${r.designation}, ${r.institution}<br>
      ${r.email}
    `;
    c.appendChild(d);
  });
}

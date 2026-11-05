/* Interactive layer for the portfolio: theme, hero network, search and filters, case studies, scroll effects.
   Plain JavaScript, no dependencies. Works alongside chat.js and guide.js. */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };

  /* Theme toggle (remembers the choice in this browser) */
  const root = document.documentElement;
  const saved = store.get("theme");
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  $("#theme").addEventListener("click", () => {
    root.dataset.theme = isDark() ? "light" : "dark";
    store.set("theme", root.dataset.theme);
  });

  /* Hero: a small animated network of nodes (a nod to neural networks) */
  const canvas = $("#net");
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let w, h, nodes = [], raf;
    const css = n => getComputedStyle(root).getPropertyValue(n).trim();
    function size() {
      const r = canvas.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height; canvas.width = w * d; canvas.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.round(Math.min(70, w * h / 16000));
      nodes = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 }));
    }
    let mouse = { x: -999, y: -999 };
    canvas.parentElement.addEventListener("pointermove", e => { const r = canvas.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; });
    canvas.parentElement.addEventListener("pointerleave", () => { mouse = { x: -999, y: -999 }; });
    function draw() {
      const a = css("--accent") || "#0b6e75", b = css("--accent2") || "#6d4bd8";
      ctx.clearRect(0, 0, w, h);
      for (const p of nodes) {
        if (!reduce) { p.x += p.vx; p.y += p.vy; }
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dm < 120 && !reduce) { p.x += (p.x - mouse.x) / dm * .6; p.y += (p.y - mouse.y) / dm * .6; }
      }
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const p = nodes[i], q = nodes[j], d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 130) { ctx.globalAlpha = (1 - d / 130) * .35; ctx.strokeStyle = (i + j) % 3 ? a : b; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      ctx.globalAlpha = .8;
      nodes.forEach((p, i) => { ctx.fillStyle = i % 4 ? a : b; ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, 6.283); ctx.fill(); });
      ctx.globalAlpha = 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    }
    size(); draw();
    addEventListener("resize", () => { cancelAnimationFrame(raf); size(); draw(); });
    document.addEventListener("visibilitychange", () => { if (document.hidden) cancelAnimationFrame(raf); else if (!reduce) draw(); });
  }

  /* Rotating headline words, typed out */
  const rot = $("#rot");
  const words = ["data pipelines", "ML models", "health-data tools", "dashboards", "AI assistants"];
  if (rot && !reduce) {
    let wi = 0, ci = words[0].length, del = true;
    (function tick() {
      const word = words[wi];
      if (del) { ci--; if (ci <= 0) { del = false; wi = (wi + 1) % words.length; } }
      else { ci++; if (ci >= words[wi].length) { del = true; rot.textContent = words[wi]; return setTimeout(tick, 1800); } }
      rot.textContent = words[wi].slice(0, Math.max(ci, 0)) || " ";
      setTimeout(tick, del ? 45 : 85);
    })();
  }

  /* Count-up numbers when the stats come into view */
  const fmt = (v, dec) => Number(v).toLocaleString("en-IE", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const counters = $$(".stat b[data-count]");
  const countIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, suf = el.dataset.suffix || "";
    countIO.unobserve(el);
    if (reduce) return;
    const t0 = performance.now(), dur = 1300;
    (function step(t) {
      const k = Math.min(1, (t - t0) / dur), ease = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(end * ease, dec) + suf;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }), { threshold: .6 });
  counters.forEach(c => countIO.observe(c));

  /* Projects: role chips (shared with guide.js) + search + skill filter */
  const cards = $$("#projects .card[data-roles]");
  const q = $("#q"), count = $("#count"), empty = $("#empty");
  let role = "all", skill = "";
  const text = c => (c.textContent + " " + c.dataset.skills).toLowerCase();
  function apply() {
    const term = (q.value || "").trim().toLowerCase();
    let n = 0;
    cards.forEach(c => {
      const okRole = role === "all" || c.dataset.roles.split(" ").includes(role);
      const okSkill = !skill || (" " + c.dataset.skills + " ").includes(" " + skill + " ");
      const okText = !term || term.split(/\s+/).every(t => text(c).includes(t));
      c.hidden = !(okRole && okSkill && okText);
      if (!c.hidden) n++;
    });
    empty.hidden = n > 0;
    const parts = [];
    if (role !== "all") parts.push($(`.chip[data-filter="${role}"]`).textContent);
    if (skill) parts.push(`using “${skill}”`);
    if (term) parts.push(`matching “${term}”`);
    $("#reset").hidden = !parts.length;
    count.textContent = parts.length ? `${n} of ${cards.length} projects · ${parts.join(" · ")}` : `${cards.length} projects`;
  }
  $$(".chip[data-filter]").forEach(ch => ch.addEventListener("click", () => { role = ch.dataset.filter; apply(); }));
  q.addEventListener("input", apply);
  const resetAll = () => {
    q.value = ""; skill = ""; role = "all";
    $$(".chip[data-filter]").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.filter === "all")));
    $$("[data-skill]").forEach(c => c.setAttribute("aria-pressed", "false"));
    apply();
  };
  $("#clear").addEventListener("click", resetAll);
  $("#reset").addEventListener("click", resetAll);
  function pickSkill(s) {
    skill = skill === s ? "" : s;
    $$("[data-skill]").forEach(c => c.setAttribute("aria-pressed", String(c.dataset.skill === skill)));
    apply();
    if (skill) $("#projects").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  $$("[data-skill]").forEach(c => { c.type = "button"; c.setAttribute("aria-pressed", "false"); c.addEventListener("click", () => pickSkill(c.dataset.skill)); });
  $$(".card .tags li").forEach(li => li.addEventListener("click", () => { q.value = li.textContent; skill = ""; apply(); }));
  addEventListener("keydown", e => {
    if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); q.focus(); }
    if (e.key === "Escape" && document.activeElement === q) { q.value = ""; apply(); q.blur(); }
  });
  apply();

  /* Card spotlight glow and gentle tilt following the pointer */
  if (!reduce && matchMedia("(hover: hover)").matches) {
    cards.forEach(c => {
      c.addEventListener("pointermove", e => {
        const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        c.style.setProperty("--mx", x + "px"); c.style.setProperty("--my", y + "px");
        c.style.transform = `perspective(900px) rotateX(${((y / r.height) - .5) * -4}deg) rotateY(${((x / r.width) - .5) * 4}deg) translateY(-2px)`;
      });
      c.addEventListener("pointerleave", () => { c.style.transform = ""; });
    });
  }

  /* Case studies (facts only from the project write-ups) */
  const CASES = {
    "p-conflict": { title: "Conflict Risk Monitor",
      problem: "Estimate, for every country, the probability of 25 or more battle deaths in the next three months, and keep the estimate current without manual work.",
      approach: "A monthly GitHub Actions pipeline downloads UCDP conflict-event data and World Bank indicators and builds a 176-country panel. Three models are compared on a time-based split, so the test data is always in the future relative to training. Results are published as a dashboard with an in-browser TF-IDF chat assistant, with no paid API.",
      result: "Gradient boosting was chosen on the validation period and scored ROC AUC 0.989 and average precision 0.959 on unseen 2022-26 data.",
      links: [["Live demo", "https://bhuvannv13.github.io/conflict-risk-monitor/"], ["Code", "https://github.com/bhuvannv13/conflict-risk-monitor"]] },
    "p-tamil": { title: "Tamil Thedal (தமிழ் தேடல்)",
      problem: "Make classical Tamil literature searchable for people who type in romanised Tamil or only half-remember a verse.",
      approach: "A Python ETL step prepares 1,549 verses (Thirukkural, Aathichudi, Puthiya Aathichudi). Search uses sound-alike matching of romanised Tamil plus a TF-IDF chat helper, all in the browser. An inscription reader enhances images with OpenCV.js (CLAHE, adaptive threshold), segments letters and compares Hu moments with Tamil-Brahmi, Grantha and Tamil reference letters; Tesseract.js reads modern Tamil.",
      result: "A free, fully client-side tool with search by theme, author and category, grammar lessons and a history timeline.",
      links: [["Live demo", "https://bhuvannv13.github.io/tamil-thedal/"], ["Code", "https://github.com/bhuvannv13/tamil-thedal"]] },
    "p-checkout": { title: "Checkout redesign A/B test",
      problem: "Decide whether a checkout redesign should ship, starting from messy raw event exports (duplicates, missing devices, inconsistent country codes, internal test accounts, zero or negative orders). The data is simulated for 200,000 users.",
      approach: "Nine SQL models in staging, intermediate and mart layers (dbt-style) with window functions for de-duplication, built into a SQLite warehouse by a small dependency-ordered runner with unique, not_null, accepted_values, positive and relationships tests. The readout uses an SRM check, two-proportion z-test, Welch t-test, bootstrap CI, CUPED, Holm correction and a power/MDE calculation. Unit tests and a GitHub Actions workflow run everything.",
      result: "Randomisation healthy (SRM p = 0.32). Conversion 4.18% to 4.40%, a +5.2% relative lift (p = 0.016); revenue per user +5.7%. No device segment significant after Holm correction, and the minimum detectable lift was about 6%, so the readout recommends shipping while monitoring for novelty decay.",
      links: [["Code", "https://github.com/bhuvannv13/checkout-experiment-analytics"]] },
    "p-hgsoc": { title: "Ovarian cancer survival (HGSOC)",
      problem: "Predict survival outcomes for high-grade serous ovarian cancer from TCGA clinical and mutation data, and explain the predictions.",
      approach: "XGBoost with SHAP explanations. A leakage review found follow-up variables that encoded the outcome; they were removed and the notebook was rerun end to end in GitHub Actions so the numbers are reproducible.",
      result: "Honest held-out performance after removing leakage: 0.78 test accuracy and 0.91 ROC AUC.",
      links: [["Code", "https://github.com/bhuvannv13/HGSOC-survival"]] }
  };
  const dlg = $("#case");
  const esc = s => String(s).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  $$("[data-case]").forEach(b => b.addEventListener("click", () => {
    const c = CASES[b.dataset.case]; if (!c) return;
    $("#case-title").textContent = c.title;
    $("#case-body").innerHTML = `<h4>Problem</h4><p>${esc(c.problem)}</p><h4>Approach</h4><p>${esc(c.approach)}</p><h4>Result</h4><p>${esc(c.result)}</p>
      <div class="btns" style="margin-top:20px">${c.links.map(([t, u], i) => `<a class="btn${i ? "" : " primary"}" href="${esc(u)}">${esc(t)}</a>`).join("")}</div>`;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }));
  $("#case-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

  /* Scroll: progress bar, back-to-top, active nav link, reveal-on-scroll */
  const bar = $("#progress"), top = $("#totop");
  const links = $$("nav.links a");
  const secs = links.map(a => $(a.getAttribute("href")));
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + "%";
    top.classList.toggle("show", scrollY > 600);
    let cur = -1;
    secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top < 120) cur = i; });
    links.forEach((a, i) => a.classList.toggle("active", i === cur));
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  top.addEventListener("click", () => scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".reveal").forEach(el => io.observe(el));
})();

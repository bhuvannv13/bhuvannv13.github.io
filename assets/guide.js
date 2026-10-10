/* Kadal (கடல், "sea"): an original cartoon guide for this portfolio.
   Runs fully in the browser with a small local knowledge base. No API keys, no cost. */
(function () {
  "use strict";
  const esc = s => LocalChat.escapeHtml(s);
  const AVATAR = `<svg viewBox="0 0 64 64" role="img" aria-label="Kadal the guide">
    <circle cx="32" cy="32" r="32" fill="#cdeef0"/>
    <path d="M14 58c3-10 10-14 18-14s15 4 18 14" fill="#ffffff"/>
    <path d="M22 46l10 8 10-8" fill="none" stroke="#0b6e75" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="32" cy="33" r="14" fill="#c98b5b"/>
    <circle cx="26.5" cy="31" r="2" fill="#1d1d1d"/><circle cx="37.5" cy="31" r="2" fill="#1d1d1d"/>
    <path d="M25 37q7 6 14 0" fill="none" stroke="#1d1d1d" stroke-width="2" stroke-linecap="round"/>
    <circle cx="23" cy="36" r="2" fill="#e9967a" opacity=".7"/><circle cx="41" cy="36" r="2" fill="#e9967a" opacity=".7"/>
    <path d="M17 26q15-14 30 0z" fill="#1e3a8a"/>
    <rect x="15" y="24" width="34" height="5" rx="2.5" fill="#ffffff"/>
    <path d="M32 13v8M29 18h6M28.5 19.5q3.5 4 7 0" fill="none" stroke="#f2c14e" stroke-width="1.6" stroke-linecap="round"/>
  </svg>`;

  const PROJECTS = [
    { id: "p-conflict", name: "Conflict Risk Monitor", keys: "conflict war risk monitor ucdp world bank pipeline forecast dashboard data engineering etl geopolitics",
      text: "This is a full data pipeline. Every month GitHub Actions downloads UCDP conflict-event data and World Bank indicators, builds a panel of 176 countries, compares a persistence baseline, logistic regression and gradient boosting on a time-based split, and publishes a dashboard with its own chat helper. It shows estimates, not predictions of war.",
      live: "https://bhuvannv13.github.io/conflict-risk-monitor/", code: "https://github.com/bhuvannv13/conflict-risk-monitor" },
    { id: "p-tamil", name: "Tamil Thedal", keys: "tamil thedal thirukkural kural aathichudi bharathi poem verse grammar history inscription kalvettu opencv search",
      text: "A search engine for 1,549 Tamil verses: you can search by word, theme, author or category, browse Thirukkural by chapter, learn grammar and history, and try an OpenCV.js inscription reader that compares letter shapes with Tamil-Brahmi, Grantha and modern Tamil. Bhuvann also won a Tamil poetry competition, so this one is close to his heart!",
      live: "https://bhuvannv13.github.io/tamil-thedal/", code: "https://github.com/bhuvannv13/tamil-thedal" },
    { id: "p-hgsoc", name: "Ovarian cancer survival (HGSOC)", keys: "hgsoc ovarian cancer survival xgboost shap tcga leakage",
      text: "XGBoost on TCGA clinical and mutation data, explained with SHAP. The best part: Bhuvann spotted follow-up variables that leaked the answer, removed them and reran everything in GitHub Actions. Honest numbers: 0.78 accuracy and 0.91 ROC AUC.",
      code: "https://github.com/bhuvannv13/HGSOC-survival" },
    { id: "p-ecg", name: "ECG heartbeat classification", keys: "ecg heart heartbeat arrhythmia cnn mit-bih signal",
      text: "A 1D CNN that sorts heartbeats from the MIT-BIH dataset into five types, with 96.01% accuracy on 21,892 beats it never saw during training.",
      code: "https://github.com/bhuvannv13/ECG_Classification_CNN" },
    { id: "p-twitter", name: "Emotion classification from tweets", keys: "twitter tweets emotion nlp bilstm sentiment text gradio",
      text: "A BiLSTM that reads tweets and guesses the emotion, using both word embeddings and a sentiment score. 90.63% test accuracy, and you can try it as a Gradio app.",
      code: "https://github.com/bhuvannv13/Twitter-Emotional-Classification" },
    { id: "p-brain", name: "Brain tumour classification", keys: "brain tumour tumor mri cnn streamlit resnet medical imaging",
      text: "CNNs that classify brain MRI scans into four classes (0.80 accuracy, 0.77 macro F1 on 2,258 test images), packaged as a Streamlit app with unit tests and CI.",
      code: "https://github.com/bhuvannv13/Brain_Tumour_classification_api" },
    { id: "p-omics", name: "Multi-omics subtyping of colon cancer", keys: "multi omics colon cancer vae autoencoder clustering ucd research internship genomics",
      text: "The UCD research internship project: a variational autoencoder combines three kinds of genomic data, then clustering, survival analysis and SHAP check whether the groups mean anything. The README reports the negative findings too, which is good science.",
      code: "https://github.com/bhuvannv13/Integrative-Multi-Omics-Subtyping-of-Colon-Adenocarcinoma-Using-Deep-Learning-and-Explainable-AI" },
    { id: "p-retail", name: "Retail sales analysis", keys: "retail sales scraping beautiful soup eda analysis",
      text: "Web scraping with Beautiful Soup, then cleaning and exploring sales, profit and customer behaviour.", code: "https://github.com/bhuvannv13/RetailSalesRegister_Data_Analysis" },
    { id: "p-vle", name: "Student engagement analysis", keys: "vle student engagement ensemble",
      text: "Ensemble models on virtual learning environment data, compared across feature-selection settings.", code: "https://github.com/bhuvannv13/VLE-Data-Analysis-Python" },
    { id: "p-rnaseq", name: "RNA-seq analysis of HER2", keys: "rna seq her2 breast cancer r deseq2",
      text: "Differential expression and pathway analysis in R to see how HER2 amplification changes gene expression.", code: "https://github.com/bhuvannv13/RNASeqinBC" },
    { id: "p-prescription", name: "Handwritten prescription reader", keys: "prescription handwritten detectron2 object detection",
      text: "Detectron2 object detection that finds handwritten medicine names on prescriptions.", code: "https://github.com/bhuvannv13/Prescription-Reader" },
  ];

  const ROLES = {
    de: { name: "Data Engineer", file: "cv/Bhuvann_Vinodh_Ram_CV_Data_Engineer.pdf", projects: ["p-conflict", "p-tamil", "p-hgsoc", "p-retail"],
          pitch: "For data engineering, look at the Conflict Risk Monitor first: scheduled extraction from two public sources, a tested transformation step and automatic publishing. Before that, Bhuvann containerised apps with Docker and shipped them through GitLab CI/CD at Smartail." },
    da: { name: "Data Analyst", file: "cv/Bhuvann_Vinodh_Ram_CV_Data_Analyst.pdf", projects: ["p-conflict", "p-retail", "p-vle", "p-hgsoc"],
          pitch: "For data analysis, the Conflict Risk Monitor dashboard and the retail sales analysis are the best starting points, followed by the survival analysis work on cancer data." },
    ai: { name: "AI Engineer", file: "cv/Bhuvann_Vinodh_Ram_CV_AI_Engineer.pdf", projects: ["p-tamil", "p-ecg", "p-hgsoc", "p-twitter", "p-brain"],
          pitch: "For AI engineering: Tamil Thedal (search, OpenCV.js and a chat helper), the ECG CNN at 96% test accuracy, and the HGSOC model where Bhuvann caught and fixed data leakage." },
  };

  const TOUR = [
    { el: ".hero", say: "Ahoy! I'm Kadal (கடல் means \"sea\" in Tamil), and I'll sail you round Bhuvann's portfolio. He's an MSc AI for Medicine graduate from UCD who builds data pipelines, dashboards and machine learning models." },
    { el: "#p-conflict", say: "First stop, the newest project: the Conflict Risk Monitor. It's a real data pipeline that refreshes itself every month and publishes a live dashboard." },
    { el: "#p-tamil", say: "Next, Tamil Thedal: search Tamil poetry by theme, author or category, learn grammar, and try the inscription reader. Everything runs in your browser for free." },
    { el: "#p-hgsoc", say: "This one shows careful science. Bhuvann found variables that leaked the answer, removed them and reported the honest, lower score." },
    { el: "#cv", say: "Need a CV? Pick the full one, or a version for Data Engineer, Data Analyst or AI Engineer roles. They're all generated from the same source." },
    { el: "#experience", say: "Experience: Trust and Safety Associate at Accenture in Dublin since March 2026, a research internship at UCD, and internships in India covering data pipelines, deep learning and Docker deployment." },
    { el: "#skills", say: "Skills, from Python and SQL to TensorFlow, PyTorch, OpenCV, Docker and GitHub Actions." },
    { el: "#contact", say: "Land ho! That's the tour. The quickest way to reach Bhuvann is LinkedIn. Ask me anything else, like \"Which projects suit a data analyst?\"" },
  ];

  const FAQ = [
    { keys: "who is bhuvann about him background introduce yourself summary profile",
      html: () => `<p>Bhuvann Vinodh Ram is based in Dublin with a Stamp 1G visa (full-time work rights in Ireland). He has an MSc in AI for Medicine and Medical Research from UCD and a BTech in Computer Science and Medical Engineering from SRIHER, Chennai, and works as a Trust and Safety Associate at Accenture.</p>` },
    { keys: "who are you kadal your name guide bot robot",
      html: () => `<p>I'm Kadal, the cabin kid of this portfolio. I'm a small helper that runs in your browser and answers from what's written on this site. I can't browse the internet, but I know every project here.</p>` },
    { keys: "experience work job accenture internship intern jobs career",
      html: () => `<ul><li><b>Accenture, Dublin</b>: Trust and Safety Associate, Mar 2026 to now</li><li><b>University College Dublin</b>: Research Intern, Apr to Sep 2025 (multi-omics deep learning)</li><li><b>SRIHER, Chennai</b>: Project Intern, Jan to Jun 2024 (video-to-data pipeline)</li><li><b>IIITDM Kancheepuram</b>: Research Intern, Dec 2022 to Feb 2023 (CNNs for breast cancer)</li><li><b>Smartail, Chennai</b>: Intern, Feb to Apr 2022 (Docker, GitLab CI/CD, Detectron2)</li></ul>` },
    { keys: "education degree university college ucd masters msc btech study gpa",
      html: () => `<p>MSc Artificial Intelligence for Medicine and Medical Research, University College Dublin (2024 to 2025, GPA 3.37/4.2), and BTech Computer Science and Medical Engineering, SRIHER Chennai (2020 to 2024).</p>` },
    { keys: "skills tools languages python sql tech stack technologies know",
      html: () => `<p>Python, SQL, R and JavaScript; pandas, scikit-learn, XGBoost, TensorFlow and PyTorch; OpenCV and Detectron2; Tableau and Plotly; Git, GitHub Actions, GitLab CI/CD, Docker and pytest.</p>` },
    { keys: "contact email reach hire linkedin message talk",
      html: () => `<p>The best way is <a href="https://www.linkedin.com/in/bhuvann-vinodh-ram-5545b3210/">LinkedIn</a>. The email address is on each CV. Code is on <a href="https://github.com/bhuvannv13">GitHub</a>.</p>` },
    { keys: "visa work permit stamp authorisation right to work ireland sponsor",
      html: () => `<p>Bhuvann holds a Stamp 1G, which allows full-time work in Ireland.</p>` },
    { keys: "cv resume download pdf",
      html: () => `<p>Here you go:</p><ul>${Object.values(ROLES).map(r => `<li><a href="${r.file}" download>${r.name} CV (PDF)</a></li>`).join("")}<li><a href="cv/Bhuvann_Vinodh_Ram_CV.pdf" download>Full CV (PDF)</a></li></ul>` },
    { keys: "awards achievements prizes hackathon nasa",
      html: () => `<p>UCD Innovation Challenge 2024 Innovation Spark Award, NASA Space Apps Challenge 2024, the UCD Advantage Award, and first place in a Tamil poetry competition.</p>` },
    { keys: "free cost api how do you work chatbot ai llm",
      html: () => `<p>I'm built with plain JavaScript: a small TF-IDF search over this site's content plus a few rules. No paid API, no keys, no tracking.</p>` },
  ];

  const docs = [
    ...PROJECTS.map(p => ({ id: p.id, text: `${p.name} ${p.keys} ${p.text}`, project: p })),
    ...FAQ.map((f, i) => ({ id: "faq" + i, text: f.keys, faq: f })),
  ];
  const index = new LocalChat.Index(docs);
  let tourStep = -1, chat = null;

  function spotlight(selector) {
    document.querySelectorAll(".spot").forEach(e => e.classList.remove("spot"));
    const el = document.querySelector(selector);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("spot");
    setTimeout(() => el.classList.remove("spot"), 3500);
  }

  function projectHtml(p) {
    const links = [p.live && `<a href="${p.live}">Try the live demo</a>`, `<a href="${p.code}">See the code</a>`].filter(Boolean).join(" · ");
    return `<p><b>${esc(p.name)}</b>: ${esc(p.text)}</p><p>${links}</p>`;
  }

  function tour(step) {
    tourStep = step;
    const s = TOUR[step];
    spotlight(s.el);
    const last = step === TOUR.length - 1;
    return { html: `<p>${esc(s.say)}</p><p class="muted"><small>Stop ${step + 1} of ${TOUR.length}</small></p>`,
             suggestions: last ? ["Which projects suit a data engineer?", "Download a CV", "Who is Bhuvann?"] : ["Next stop", "End the tour"] };
  }

  async function answer(text) {
    const t = LocalChat.normalise(text);
    if (/^(next|next stop|continue|go on|yes|ok|okay)\b/.test(t) && tourStep >= 0 && tourStep < TOUR.length - 1) return tour(tourStep + 1);
    if (/(tour|show me around|guide me|start)/.test(t) && !/end/.test(t)) return tour(0);
    if (/end the tour|stop/.test(t)) { tourStep = -1; return { html: "<p>Tour ended. Ask me about any project, the CVs, or Bhuvann's experience.</p>" }; }
    const role = /engineer/.test(t) && /data/.test(t) ? "de" : /analy/.test(t) ? "da" : /(ai|ml|machine learning) ?engineer|ai role|ml role/.test(t) ? "ai" : null;
    if (role) {
      const r = ROLES[role];
      return { html: `<p>${esc(r.pitch)}</p><ul>${r.projects.map(id => PROJECTS.find(p => p.id === id)).map(p => `<li><a href="#${p.id}" data-spot="#${p.id}">${esc(p.name)}</a></li>`).join("")}</ul><p><a href="${r.file}" download>Download the ${r.name} CV</a></p>`,
               suggestions: ["Tell me about the Conflict Risk Monitor", "Tell me about Tamil Thedal", "Contact"] };
    }
    const hits = index.search(text, 1);
    if (hits.length && hits[0].score > 0.06) {
      const d = hits[0].doc;
      if (d.project) { spotlight("#" + d.project.id); return { html: projectHtml(d.project) }; }
      return { html: d.faq.html() };
    }
    return { html: `<p>Hmm, my compass can't find that one. Try "take the tour", a project name like "ECG", "skills", or "which projects suit a data analyst?"</p>` };
  }

  document.addEventListener("DOMContentLoaded", () => {
    chat = LocalChat.createChat({
      title: "Kadal · your guide", subtitle: "Answers from this portfolio · runs in your browser", launcherLabel: "Ask Kadal",
      avatar: AVATAR, placeholder: "Ask about a project, the CV, skills…",
      greeting: `<p>Ahoy, I'm Kadal! Want a quick tour of Bhuvann's work, or shall I point you to the projects for a particular role?</p>`,
      suggestions: ["Take the tour", "Which projects suit a data engineer?", "Which projects suit a data analyst?", "Which projects suit an AI engineer?", "Download a CV"],
      answer,
    });
    const start = document.getElementById("tour-start");
    if (start) start.addEventListener("click", () => chat.ask("Take the tour"));
    document.addEventListener("click", e => {
      const a = e.target.closest("a[data-spot]");
      if (a) { e.preventDefault(); spotlight(a.dataset.spot); }
    });
    // Project filter chips
    document.querySelectorAll(".chip[data-filter]").forEach(chip => chip.addEventListener("click", () => {
      const f = chip.dataset.filter;
      document.querySelectorAll(".chip[data-filter]").forEach(c => c.setAttribute("aria-pressed", String(c === chip)));
      document.querySelectorAll("#projects .card[data-roles]").forEach(card => { card.hidden = f !== "all" && !card.dataset.roles.split(" ").includes(f); });
    }));
  });
})();

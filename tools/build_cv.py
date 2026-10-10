"""Build the CVs from one source of truth.

    python tools/build_cv.py          # writes cv/*.html
    python tools/build_cv.py --pdf    # also renders cv/*.pdf with Playwright (Chromium)

Every figure here comes from a repository README or a recorded run. Edit DATA and rebuild.
"""
import argparse
import html
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "cv"
GH = "https://github.com/bhuvannv13/"

PERSON = {
    "name": "Bhuvann Vinodh Ram",
    "location": "Dublin, Ireland",
    "status": "Stamp 1G: full-time work authorisation in Ireland",
    "email": "bhuvannvinodhram@gmail.com",
    "links": [
        ("bhuvannv13.github.io", "https://bhuvannv13.github.io/"),
        ("github.com/bhuvannv13", "https://github.com/bhuvannv13"),
        ("linkedin.com/in/bhuvann-vinodh-ram-5545b3210", "https://www.linkedin.com/in/bhuvann-vinodh-ram-5545b3210/"),
    ],
}

EXPERIENCE = [
    {"key": "accenture", "org": "Accenture", "role": "Trust and Safety Associate", "where": "Dublin, Ireland",
     "when": "Mar 2026 – Present",
     "bullets": {"all": ["Evaluate, classify and moderate user-generated content against client platform policies to keep online communities safe and compliant."]}},
    {"key": "ucd", "org": "University College Dublin", "role": "Research Intern", "where": "Dublin, Ireland",
     "when": "Apr 2025 – Sep 2025",
     "bullets": {
         "de": ["Integrated TCGA colon adenocarcinoma RNA-seq, copy-number and DNA methylation data for a shared set of patients into one analysis-ready dataset.",
                "Built a variational autoencoder to compress the three data types into a single latent representation for downstream clustering."],
         "da": ["Clustered TCGA colon adenocarcinoma patients from integrated multi-omics data (K-Means, HDBSCAN) and evaluated clusters with silhouette scores.",
                "Tested clinical relevance with Kaplan–Meier curves and log-rank tests, and reported which genes drove the groups using differential expression and SHAP."],
         "ai": ["Designed and trained a variational autoencoder over RNA-seq, copy-number and methylation data, then clustered the latent space (K-Means, HDBSCAN).",
                "Explained the results with SHAP, differential expression and STRING networks, and assessed survival differences with Kaplan–Meier and log-rank tests."],
         "all": ["Integrated TCGA colon adenocarcinoma RNA-seq, copy-number and DNA methylation data and trained a variational autoencoder to learn a shared latent representation.",
                 "Clustered the latent space (K-Means, HDBSCAN), evaluated with silhouette scores, and tested clinical relevance with Kaplan–Meier curves, log-rank tests, SHAP and STRING networks."]}},
    {"key": "sriher", "org": "Centre for Toxicology and Development, SRIHER", "role": "Project Intern", "where": "Chennai, India",
     "when": "Jan 2024 – Jun 2024",
     "bullets": {
         "de": ["Built a video-to-data pipeline that turned zebrafish behaviour videos into numerical tracking data for drug-testing studies."],
         "da": ["Converted zebrafish behaviour videos into tracking data and computed speed and velocity measures across tanks and layers.",
                "Produced charts and written reports summarising behavioural trends for the research team."],
         "all": ["Built a video-to-data pipeline for zebrafish behaviour analysis used in drug testing: tracked fish across tanks and layers, computed speed and velocity, and produced charts and reports."]}},
    {"key": "iiitdm", "org": "IIITDM Kancheepuram", "role": "Research Intern", "where": "Chennai, India",
     "when": "Dec 2022 – Feb 2023",
     "bullets": {"all": ["Developed and compared CNN breast cancer classifiers using pre-trained VGG16, ResNet, MobileNet and EfficientNet models."]}},
    {"key": "smartail", "org": "Smartail Pvt. Ltd.", "role": "Intern", "where": "Chennai, India",
     "when": "Feb 2022 – Apr 2022",
     "bullets": {
         "de": ["Containerised web applications with Docker and deployed them to servers through GitLab CI/CD pipelines."],
         "all": ["Containerised web applications with Docker and deployed them through GitLab CI/CD pipelines.",
                 "Worked on image processing with Detectron2, including hyperparameter tuning."]}},
]

PROJECTS = {
    "conflict": {"name": "Conflict Risk Monitor", "year": "2026",
                 "links": [("Live", "https://bhuvannv13.github.io/conflict-risk-monitor/"), ("Code", GH + "conflict-risk-monitor")],
                 "tags": "Python · pandas · scikit-learn · GitHub Actions · JavaScript",
                 "bullets": {
                     "de": ["End-to-end pipeline: downloads UCDP conflict-event data (final and monthly releases) and World Bank indicators, builds a 176-country monthly panel, and publishes JSON to a static dashboard.",
                            "Scheduled GitHub Actions job refreshes data and retrains every month; pytest suite includes a check that features never use future data."],
                     "da": ["Dashboard of country-level risk of armed-conflict violence: KPI tiles, trend charts, searchable table and country drill-downs, built from UCDP and World Bank open data.",
                            "Compared a persistence baseline, logistic regression and gradient boosting on a time-based split; on 2022–26 test data the chosen model reached ROC AUC 0.989 against 0.981 for the baseline."],
                     "ai": ["Estimates the probability of 25+ battle deaths per country in the next three months; gradient boosting chosen on a validation period scored ROC AUC 0.989 and average precision 0.959 on unseen 2022–26 data.",
                            "In-browser chat assistant (TF-IDF retrieval, no paid API) answers questions from the published data."]}},
    "tamil": {"name": "Tamil Thedal (தமிழ் தேடல்)", "year": "2026",
              "links": [("Live", "https://bhuvannv13.github.io/tamil-thedal/"), ("Code", GH + "tamil-thedal")],
              "tags": "JavaScript · OpenCV.js · Tesseract.js · Python ETL",
              "bullets": {
                  "de": ["ETL script builds 1,549 verses from open sources at a pinned commit, keeps only public-domain fields, adds themes, and is rebuilt by GitHub Actions with tests."],
                  "da": ["Search engine over 1,549 Tamil verses with filters by work, author, category and 17 themes, plus grammar lessons and a history timeline."],
                  "ai": ["Search engine for Tamil literature (1,549 verses) with sound-alike matching of romanised Tamil and a TF-IDF chat helper that runs fully in the browser.",
                         "Inscription reader: OpenCV.js enhancement (CLAHE, adaptive threshold), letter segmentation and Hu-moment comparison with Tamil-Brahmi, Grantha and Tamil reference letters; Tesseract.js OCR for modern Tamil."]}},
    "hgsoc": {"name": "Ovarian cancer survival prediction (HGSOC)", "year": "2025",
              "links": [("Code", GH + "HGSOC-survival")], "tags": "XGBoost · SHAP · TCGA",
              "bullets": {"all": ["XGBoost on TCGA clinical and mutation data with SHAP explanations; found and removed follow-up variables that leaked the outcome, then reran the notebook end to end in GitHub Actions: test accuracy 0.78, ROC AUC 0.91."]}},
    "ecg": {"name": "ECG heartbeat classification", "year": "2025",
            "links": [("Code", GH + "ECG_Classification_CNN")], "tags": "1D CNN · Keras",
            "bullets": {"all": ["1D CNN classifying MIT-BIH heartbeats into five classes: 96.01% test accuracy on 21,892 held-out beats, reproduced by an automated GitHub Actions rerun."]}},
    "twitter": {"name": "Emotion classification from tweets", "year": "2025",
                "links": [("Code", GH + "Twitter-Emotional-Classification")], "tags": "BiLSTM · TensorFlow · Gradio",
                "bullets": {"all": ["Dual-input BiLSTM combining word embeddings with sentiment polarity: 90.63% test accuracy, served as a Gradio app."]}},
    "brain": {"name": "Brain tumour classification from MRI", "year": "2025",
              "links": [("Code", GH + "Brain_Tumour_classification_api")], "tags": "CNN · OpenCV · Streamlit · pytest",
              "bullets": {"all": ["Four-class CNN (0.80 accuracy, 0.77 macro F1 on 2,258 test images) and ResNet50 transfer learning, deployed as a Streamlit app with unit tests and CI."]}},
    "omics": {"name": "Multi-omics subtyping of colon cancer", "year": "2025",
              "links": [("Code", GH + "Integrative-Multi-Omics-Subtyping-of-Colon-Adenocarcinoma-Using-Deep-Learning-and-Explainable-AI")],
              "tags": "VAE · HDBSCAN · SHAP · survival analysis",
              "bullets": {"all": ["Research project behind the UCD internship: VAE integration of three omics layers, clustering, and survival and pathway analysis, with negative findings reported honestly."]}},
    "prescription": {"name": "Handwritten prescription reader", "year": "2023",
                     "links": [("Code", GH + "Prescription-Reader")], "tags": "Detectron2 · object detection",
                     "bullets": {"all": ["Detectron2 model that locates handwritten medicine names in prescription images, trained on a custom annotated dataset."]}},
    "vle": {"name": "Student engagement analysis (VLE)", "year": "2025",
            "links": [("Code", GH + "VLE-Data-Analysis-Python")], "tags": "scikit-learn · ensembles",
            "bullets": {"all": ["Voting ensembles (random forest, logistic regression, gradient boosting, SVM) on virtual learning environment data, compared across feature-selection settings."]}},
    "retail": {"name": "Retail sales register analysis", "year": "2025",
               "links": [("Code", GH + "RetailSalesRegister_Data_Analysis")], "tags": "Requests · Beautiful Soup · pandas",
               "bullets": {"all": ["Scraped multi-page sales records, cleaned dates, currencies and missing values, and analysed revenue, profit and customer behaviour by location and age group."]}},
    "rnaseq": {"name": "RNA-seq analysis of HER2 breast cancer", "year": "2024",
               "links": [("Code", GH + "RNASeqinBC")], "tags": "R · DESeq2 · clusterProfiler",
               "bullets": {"all": ["Differential expression, pathway enrichment and survival predictors in R to study how HER2 amplification changes gene expression."]}},
    "tableau": {"name": "Wimbledon Championship dashboard", "year": "2021",
                "links": [("Code", GH + "Tableau-Wimbledon-Championship")], "tags": "Tableau",
                "bullets": {"all": ["Interactive Tableau dashboard of Wimbledon results and player statistics."]}},
    "teeth": {"name": "Teeth segmentation in dental X-rays", "year": "2024", "links": [], "tags": "U-Net",
              "bullets": {"all": ["Semantic segmentation of panoramic dental X-rays with U-Net for diagnostic measurement."]}},
}

SKILLS = {
    "de": [("Languages", "Python, SQL, R (basic), Bash"),
           ("Pipelines", "ETL with pandas and NumPy, REST APIs, bulk file ingestion, web scraping (Requests, Beautiful Soup), data validation"),
           ("Engineering", "Git, GitHub Actions (CI and scheduled jobs), GitLab CI/CD, Docker, pytest, Linux"),
           ("Data stores", "CSV and JSON, MySQL, MongoDB (basic)"),
           ("Also", "scikit-learn, Tableau, Jupyter")],
    "da": [("Analysis", "Python (pandas, NumPy, SciPy), SQL, R; statistics, hypothesis testing, survival analysis (Kaplan–Meier, log-rank)"),
           ("Visualisation", "Tableau, matplotlib, seaborn, Plotly, interactive web dashboards"),
           ("Data preparation", "Cleaning, validation, web scraping (Requests, Beautiful Soup), feature engineering"),
           ("Modelling", "Regression, classification, clustering, ensembles, model evaluation"),
           ("Tools", "Jupyter, Git, GitHub Actions")],
    "ai": [("Languages", "Python, SQL, JavaScript, R (basic)"),
           ("Machine learning", "scikit-learn, XGBoost, ensembles, hyperparameter tuning, leakage checks, time-based validation"),
           ("Deep learning", "TensorFlow/Keras, PyTorch; CNNs, BiLSTM, VAEs, U-Net; transfer learning (ResNet50, VGG16, EfficientNet, MobileNet)"),
           ("Vision and language", "OpenCV, OpenCV.js, Detectron2, Tesseract.js; text classification, embeddings, TF-IDF retrieval"),
           ("Explainability", "SHAP, model interpretation"),
           ("Shipping models", "Streamlit, Gradio, GitHub Pages, Docker, GitHub Actions, pytest")],
    "all": [("Languages", "Python, SQL, R, MATLAB (basic), JavaScript, Bash"),
            ("Machine learning", "scikit-learn, XGBoost, TensorFlow/Keras, PyTorch; CNNs, BiLSTM, VAEs, U-Net; SHAP"),
            ("Data", "pandas, NumPy, SciPy, ETL pipelines, REST APIs, web scraping, statistics, survival analysis"),
            ("Vision", "OpenCV, OpenCV.js, Detectron2, Tesseract.js"),
            ("Visualisation", "Tableau, matplotlib, seaborn, Plotly"),
            ("Engineering", "Git, GitHub Actions, GitLab CI/CD, Docker, pytest, Streamlit, Gradio, MySQL, MongoDB (basic)")],
}

EDUCATION = [
    ("University College Dublin", "MSc Artificial Intelligence for Medicine and Medical Research", "2024 – 2025", "GPA 3.37 / 4.2"),
    ("Sri Ramachandra Institute of Higher Education and Research, Chennai", "BTech Computer Science and Medical Engineering", "2020 – 2024", "CGPA 3.18 / 4"),
]

AWARDS = {
    "short": ["UCD Innovation Challenge 2024: Innovation Spark Award", "NASA Space Apps Challenge 2024 participant", "UCD Advantage Award"],
    "all": ["UCD Innovation Challenge 2024: Innovation Spark Award", "NASA Space Apps Challenge 2024: built a climate storytelling website with a team",
            "UCD Advantage Award", "First place, Tamil poetry competition (Agal Tamil Club)", "Second place, Palaestra intramural volleyball tournament"],
}

VARIANTS = {
    "Bhuvann_Vinodh_Ram_CV": {
        "label": "Full CV", "track": "all", "title": "Data and AI Graduate · MSc AI for Medicine (UCD)",
        "summary": "MSc graduate in Artificial Intelligence for Medicine from University College Dublin with hands-on experience across the data lifecycle: building pipelines from public data sources, analysing and visualising data, and training, explaining and deploying machine learning models for imaging, signals, text and genomics. Every project below has public code, and most have tests, CI and a live demo. Currently a Trust and Safety Associate at Accenture, Dublin.",
        "projects": ["conflict", "tamil", "hgsoc", "ecg", "twitter", "brain", "prescription", "vle", "retail", "rnaseq", "tableau", "teeth"],
        "awards": "all"},
    "Bhuvann_Vinodh_Ram_CV_Data_Engineer": {
        "label": "Data Engineer", "track": "de", "title": "Graduate Data Engineer",
        "summary": "MSc AI for Medicine graduate (UCD) who builds reproducible data pipelines: automated extraction from APIs and bulk files, cleaning and modelling in pandas, tests and CI in GitHub Actions, and scheduled refreshes that publish results to the web. Industry experience containerising applications with Docker and deploying them through GitLab CI/CD. Currently a Trust and Safety Associate at Accenture, Dublin.",
        "projects": ["conflict", "tamil", "hgsoc", "retail"], "awards": "short"},
    "Bhuvann_Vinodh_Ram_CV_Data_Analyst": {
        "label": "Data Analyst", "track": "da", "title": "Graduate Data Analyst",
        "summary": "MSc AI for Medicine graduate (UCD) who turns messy data into clear answers: scraping and cleaning data, statistical and survival analysis, and dashboards and reports written for non-technical readers. Python (pandas, seaborn), SQL, R and Tableau. Currently a Trust and Safety Associate at Accenture, Dublin, classifying content against detailed policy.",
        "projects": ["conflict", "retail", "vle", "hgsoc", "tableau"], "awards": "short"},
    "Bhuvann_Vinodh_Ram_CV_AI_Engineer": {
        "label": "AI Engineer", "track": "ai", "title": "Graduate AI / Machine Learning Engineer",
        "summary": "MSc AI for Medicine graduate (UCD) who builds and ships machine learning: CNNs, BiLSTMs, VAEs and gradient boosting on imaging, signal, text and genomics data, with SHAP explanations, leakage checks, tests and CI. Deploys models as Streamlit and Gradio apps and in-browser tools that cost nothing to run. Currently a Trust and Safety Associate at Accenture, Dublin.",
        "projects": ["tamil", "conflict", "ecg", "hgsoc", "twitter", "brain"], "awards": "short"},
}

CSS = """
@page{size:A4;margin:12mm 14mm}
*{box-sizing:border-box}
body{font-family:Inter,"Segoe UI",Arial,sans-serif;color:#16202c;font-size:9.4pt;line-height:1.36;margin:0}
a{color:#0b6e75;text-decoration:none}
h1{font-size:20pt;margin:0;letter-spacing:-.01em}
.title{font-size:11pt;color:#0b6e75;font-weight:600;margin:2px 0 4px}
.contact{color:#3c4856;font-size:8.8pt}
.contact span+span::before{content:"  ·  ";color:#9aa7b4}
h2{font-size:10.5pt;text-transform:uppercase;letter-spacing:.08em;color:#0b6e75;border-bottom:1px solid #cfd8de;padding-bottom:2px;margin:11px 0 5px}
p{margin:0 0 4px}
.row{display:flex;justify-content:space-between;gap:12px}
.row b{font-weight:600}
.row>span:last-child{white-space:nowrap}
.muted{color:#566273}
ul{margin:2px 0 6px;padding-left:15px}
li{margin:1px 0}
.item{margin-bottom:5px;break-inside:avoid}
.skill{margin:0 0 2px}
.skill b{font-weight:600}
.tags{color:#566273;font-size:8.6pt}
"""


def esc(text):
    return html.escape(text, quote=True)


def bullets_for(entry, track):
    b = entry["bullets"]
    if b.get(track):
        return b[track]
    if b.get("all"):
        return b["all"]
    # Full CV: take the lead bullet from each role-specific list.
    return [items[0] for items in (b.get("de"), b.get("ai")) if items]


def render(slug, variant):
    track = variant["track"]
    out = [f"<!doctype html><html lang='en'><head><meta charset='utf-8'><title>{esc(PERSON['name'])} – {esc(variant['label'])} CV</title>",
           "<link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap' rel='stylesheet'>",
           f"<style>{CSS}</style></head><body>",
           f"<h1>{esc(PERSON['name'])}</h1><div class='title'>{esc(variant['title'])}</div>",
           "<div class='contact'>" + "".join(f"<span>{x}</span>" for x in [
               esc(PERSON["location"]), f"<a href='mailto:{PERSON['email']}'>{esc(PERSON['email'])}</a>",
               *[f"<a href='{u}'>{esc(t)}</a>" for t, u in PERSON["links"]]]) + "</div>",
           f"<div class='contact'><span>{esc(PERSON['status'])}</span></div>",
           f"<h2>Profile</h2><p>{esc(variant['summary'])}</p>",
           "<h2>Skills</h2>" + "".join(f"<p class='skill'><b>{esc(k)}:</b> {esc(v)}</p>" for k, v in SKILLS[track]),
           "<h2>Experience</h2>"]
    for e in EXPERIENCE:
        items = bullets_for(e, track)
        out.append(f"<div class='item'><div class='row'><span><b>{esc(e['role'])}</b>, {esc(e['org'])} <span class='muted'>· {esc(e['where'])}</span></span><span class='muted'>{esc(e['when'])}</span></div>"
                   + "<ul>" + "".join(f"<li>{esc(x)}</li>" for x in items) + "</ul></div>")
    out.append("<h2>Projects</h2>")
    for key in variant["projects"]:
        p = PROJECTS[key]
        links = " · ".join(f"<a href='{u}'>{esc(t)}: {esc(u.replace('https://', '').rstrip('/'))}</a>" for t, u in p["links"])
        out.append(f"<div class='item'><div class='row'><span><b>{esc(p['name'])}</b> <span class='tags'>· {esc(p['tags'])}</span></span><span class='muted'>{esc(p['year'])}</span></div>"
                   + (f"<div class='tags'>{links}</div>" if links else "")
                   + "<ul>" + "".join(f"<li>{esc(x)}</li>" for x in bullets_for(p, track)) + "</ul></div>")
    out.append("<h2>Education</h2>")
    for school, degree, when, grade in EDUCATION:
        out.append(f"<div class='item'><div class='row'><span><b>{esc(degree)}</b>, {esc(school)}</span><span class='muted'>{esc(when)}</span></div><div class='muted'>{esc(grade)}</div></div>")
    out.append("<h2>Awards</h2><ul>" + "".join(f"<li>{esc(a)}</li>" for a in AWARDS[variant["awards"]]) + "</ul>")
    out.append("</body></html>")
    return "\n".join(out)


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", action="store_true")
    args = parser.parse_args(argv)
    OUT.mkdir(exist_ok=True)
    pages = []
    for slug, variant in VARIANTS.items():
        path = OUT / f"{slug}.html"
        path.write_text(render(slug, variant), encoding="utf-8")
        pages.append(path)
    if args.pdf:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            for path in pages:
                page.goto(path.resolve().as_uri(), wait_until="networkidle")
                page.evaluate("document.fonts.ready")
                page.pdf(path=str(path.with_suffix(".pdf")), format="A4", print_background=True, prefer_css_page_size=True)
            browser.close()
    print("Built:", ", ".join(p.name for p in pages))


if __name__ == "__main__":
    main()

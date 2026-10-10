// Single source of truth for project cards (Home) and detail pages (/projects/:slug).
// `link` is optional: when present, the card shows a "Code →" link to GitHub.
// detail.build / detail.future / detail.government are optional lists shown on the detail page.

export const PROJECTS = [
  {
    slug: "truthlens",
    title: "TruthLens",
    subtitle: "M.Tech project — Document fraud detection",
    status: "In progress (Phase 2 complete)",
    period: "M.Tech, IIIT Dharwad · 2025–26",
    desc: "Fine-tuned EfficientNet-B4 to spot tampering in documents like Aadhaar and PAN cards, reaching 98.18% test accuracy on a curated dataset of about 15,000 images. Uses a synthetic Indian government document generator for training, with Grad-CAM explainability on top.",
    tech: ["PyTorch", "EfficientNet-B4", "Grad-CAM", "ELA", "Streamlit"],
    link: "https://github.com/Shravaniroyal/TruthLens",
    detail: {
      problem:
        "Document fraud is rising, but the usual defences each fall short: manual inspection misses pixel-level edits, forensic labs are slow and expensive, and metadata checks are trivially bypassed. TruthLens takes a document image and returns a fraud verdict in seconds, with visual evidence a non-specialist reviewer can follow.",
      approach: [
        "Five-module pipeline: preprocessing, EfficientNet-B4 classification, adaptive thresholding, explainability (Grad-CAM + Error Level Analysis), and a Streamlit front end.",
        "Dataset combines DocTamper (CVPR 2023), RVL-CDIP authentic documents, and synthetic Aadhaar, PAN and driving licence images, since real Indian ID documents cannot legally be collected for research.",
        "Tampered synthetic samples are produced by value substitution, font perturbation and localised re-compression.",
        "Training uses class-weighted binary cross-entropy, AdamW with discriminative learning rates, cosine annealing with warm restarts, and early stopping.",
        "The FAKE verdict uses a deliberately conservative confidence threshold (0.85) to reduce false accusations against genuine submitters.",
      ],
      build: [
        "Data: authentic documents from RVL-CDIP and DocTamper, plus a synthetic generator that produces Indian Aadhaar, PAN and driving licence images, so no real personal data is used.",
        "Tamper simulation: fake samples are created by changing values, perturbing fonts and re-compressing only part of the image, which mimics real editing traces.",
        "Model: an EfficientNet-B4 backbone fine-tuned as a binary real-versus-fake classifier, using class-weighted loss, AdamW, discriminative learning rates, cosine annealing with warm restarts and early stopping.",
        "Decision layer: adaptive thresholding turns the score into a verdict, and a document is called FAKE only above a confidence of 0.85.",
        "Explainability: Grad-CAM heatmaps show which regions drove the decision, and Error Level Analysis highlights areas with different compression history.",
        "Interface: a Streamlit app where a reviewer uploads a document and sees the verdict, the heatmap and the supporting evidence together.",
      ],
      results: [
        { label: "Test accuracy", value: "98.18%" },
        { label: "ROC-AUC", value: "0.9971" },
        { label: "Macro F1", value: "0.98" },
        { label: "Backbone latency (CPU)", value: "1.4 s" },
      ],
      future: [
        "Phase 3 validation: check Grad-CAM against DocTamper masks, calibrate false positives on Indian documents, run ablations, and deploy as a web app.",
        "One analysis core, two entry points: pull the analysis into a single analyze() function that both the Streamlit app and a new REST API call, so there is only one model to maintain.",
        "Product API: POST /analyze for a single document, POST /batch with job status for many, protected by a simple API key or login and the same upload checks the app already uses.",
        "OCR and QR reading with no government keys: detect the document type from the image itself, check PAN, Aadhaar and driving licence number formats, compare the QR code against the printed text, and mask names, dates of birth and ID numbers in logs.",
        "Multi-page PDFs and poor photos: accept PDFs, and warn about blur or glare early, so a bad WhatsApp scan is rejected instead of getting a wrong REAL or FAKE.",
        "Batch background verification: checklists for college admissions, job joining and vendor onboarding, a case file per candidate, an UNCERTAIN queue for a human reviewer, and CSV and PDF export.",
        "Privacy and deployment: user roles, automatic deletion of uploaded images, Docker packaging, and a clear disclaimer that a visual screen is not a legal KYC check.",
        "Official verification hook: a switch that starts as not_configured, so verification APIs such as Setu can be connected later without retraining the model.",
        "Deliberately left out of the first build: live UIDAI or PAN access, scraping government sites, and retraining the EfficientNet.",
      ],
      government: [
        "First-pass screening at scale: government and regulated offices that receive large volumes of ID documents could screen them first, then send only suspicious or UNCERTAIN cases to a human reviewer and to official verification.",
        "Possible users: bank and telecom KYC desks, university admission and recruitment offices, vendor onboarding for public bodies, and welfare or licensing counters that check supporting documents.",
        "Evidence a reviewer can follow: the heatmap and the audit log mean a decision can be explained and checked afterwards, which matters for public services.",
        "Privacy by design: training on synthetic documents, masked logs and automatic deletion fit data-protection rules such as India's Digital Personal Data Protection Act, 2023.",
        "Sensible path to adoption: start with a small pilot in one department, measure the false-accept and false-reject rates on real traffic, and add official verification before anyone relies on it.",
        "Important limit: TruthLens is a screening aid. It does not replace legal verification, and its results are not proof of forgery on their own.",
      ],
      notes: [
        "Results are from the Phase 2 prototype and are not a final, fully validated result.",
        "The future items above are plans, not features that exist today.",
      ],
    },
  },
  {
    slug: "biometric-watermarking",
    title: "Biometric Watermarking",
    subtitle: "B.E. project — Rubik's Cube encryption",
    status: "Completed · Published in JETIR 2024",
    period: "B.E., RRCE Bengaluru · 2024–25",
    desc: "A zero-bit watermarking system that combines iris features with an encrypted fingerprint to create a unique master share for each user, secured with Rubik's Cube scrambling and OTP verification.",
    tech: ["Python", "OpenCV", "NumPy", "CNN", "DWT + SVD"],
    link: "https://github.com/Shravaniroyal/Biometric-Watermarking-System",
    detail: {
      problem:
        "Biometric data such as iris and fingerprint images is highly sensitive, and conventional watermarking (LSB, DCT, DWT, DFT) can degrade image quality or fail against advanced attacks. Even a small change to a biometric image can compromise the identity it represents, so the system needs to protect the data without altering it.",
      approach: [
        "Zero-bit watermarking: features are derived from the iris image, so the host image itself is left unmodified.",
        "Iris pipeline: grayscale conversion, Canny edge detection, Hough transform for segmentation, and Daugman's rubber sheet model for normalization.",
        "Feature extraction with DWT and SVD, plus a CNN for iris and fingerprint features.",
        "The fingerprint (watermark) is encrypted with Rubik's Cube pixel scrambling and XOR, then combined with iris features to produce a master share that acts as the user's ID.",
        "Authentication compares the extracted watermark with the one stored in the database. OTPs delivered over Telegram gate both encryption and decryption.",
      ],
      build: [
        "Input: the user uploads an original image, an iris image and a fingerprint image through a web interface.",
        "Iris processing: convert to grayscale, find edges with Canny, locate the iris and pupil with the Hough transform, then normalise the iris with Daugman's rubber sheet model.",
        "Feature generation: apply DWT and keep the LL band, split it into blocks, take the first singular value of each block with SVD, and compare neighbouring values to build a binary matrix. A CNN is also trained to extract iris and fingerprint features.",
        "Master share: the binary matrix is combined with the encrypted fingerprint using XOR, and the result is encrypted again to form the master share, which is the user's ID.",
        "Encryption: pixels are scrambled with a Rubik's Cube style permutation and XOR, and an OTP sent over Telegram must be entered before encrypting or decrypting.",
        "Evaluation: PSNR measures image quality and Bit Error Rate measures robustness, and CNN accuracy and loss graphs are used to check the biometric model.",
        "Stack: Python, OpenCV and NumPy, with a simple web front end for upload, encryption and decryption.",
      ],
      results: [
        { label: "Published", value: "JETIR, Vol. 11, Issue 12, 2024" },
        { label: "Evaluation", value: "PSNR (quality) and BER (robustness)" },
      ],
      future: [
        "Train and test on larger public fingerprint and iris datasets, and report the accuracy and error rates in full.",
        "Make it faster: the report notes computational overhead, so optimise the encryption and the CNN for low-power devices.",
        "Move storage to a protected cloud database with proper key management, and test the system against deliberate attacks.",
        "Add more biometric traits, such as face, and offer a mobile app for enrolment and verification.",
      ],
      government: [
        "Protecting stored biometric templates: identity and e-governance systems keep large biometric databases, and a scheme that does not alter the stored image and encrypts the identifier could make leaks less harmful.",
        "Possible uses: secure authentication for citizen-service portals, protecting biometric records held by public offices, and tamper checks on identity images shared between departments.",
        "Anything used for national identity would need independent security testing and certification first.",
      ],
      notes: [
        "Reported outcome: unique master shares per image and resilience against common image-processing attacks.",
        "Limitations noted in the report: computational overhead, dependence on input image quality, and scalability for large user volumes.",
      ],
    },
  },
  {
    slug: "space-traffic-density",
    title: "Space Traffic Density Prediction",
    subtitle: "Orbital congestion classification",
    status: "Completed internship project",
    period: "Rooman Technologies (NSDC / Skill India) · 2024–25",
    desc: "Machine learning models that classify orbital traffic density from satellite parameters. A Decision Tree classifier reached 89.3% accuracy, with operational status, inclination and apogee as the most influential features.",
    tech: ["Python", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn"],
    link: "https://github.com/Shravaniroyal/Space-Traffic-Density-Prediction",
    detail: {
      problem:
        "Low Earth Orbit is increasingly crowded, and current tracking is mostly reactive: it warns about collisions after a close approach is predicted. The goal was to forecast congestion so operators can plan launches and orbits earlier.",
      approach: [
        "Orbital data from public sources such as Space-Track and CelesTrak, cleaned and merged into a structured dataset.",
        "Features include perigee, apogee, inclination and operational status, with traffic density grouped into classes.",
        "Exploratory analysis with distribution plots, correlation heatmaps and model comparisons.",
        "Compared Decision Tree, Random Forest, KNN, Logistic Regression and SVM using accuracy and confusion matrices.",
      ],
      build: [
        "Data collection: orbital data (Two-Line Element sets) from public catalogues such as Space-Track and CelesTrak.",
        "Cleaning: remove missing and duplicate records, standardise timestamps, and drop outliers such as impossible speeds or positions.",
        "Features: perigee, apogee, inclination and operational status, with traffic density grouped into low, medium and high classes.",
        "Exploration: histograms, correlation heatmaps and feature-importance plots with Matplotlib and Seaborn to see which parameters matter.",
        "Modelling: Decision Tree, Random Forest, Logistic Regression, KNN and SVM trained and compared on accuracy and confusion matrices.",
        "Result: the Decision Tree was most accurate, and operational status, inclination and apogee were the most influential features.",
      ],
      results: [
        { label: "Decision Tree", value: "89.3%" },
        { label: "Random Forest", value: "86.7%" },
        { label: "Logistic Regression", value: "84.0%" },
        { label: "KNN", value: "82.7%" },
        { label: "SVM", value: "79.3%" },
      ],
      future: [
        "Forecast over time: add time-series models, such as LSTM or gradient boosting on lagged traffic counts, to predict congestion days or weeks ahead.",
        "Live data: connect to regularly updated orbital feeds so predictions refresh as new satellites launch.",
        "Visualisation: heatmaps and 3D orbit views that show which altitude bands are filling up.",
        "Alerts: warn operators when a region is predicted to become crowded, before conjunction warnings appear.",
      ],
      government: [
        "Space situational awareness: national space agencies could use density forecasts to plan launch windows and choose safer orbital slots.",
        "Policy support: regulators could use data-backed congestion trends when setting rules on satellite deployment and end-of-life disposal.",
        "Possible users: space agencies, defence and civil planners, and satellite operators working with government programmes.",
        "It would need validation on real operational data before anyone relies on it for decisions.",
      ],
      notes: [
        "Completed as part of the AI Data Quality Analyst internship (NCVET-recognised, Skill India), graded A.",
      ],
    },
  },
  {
    slug: "brainguard-ai",
    title: "BrainGuard AI",
    subtitle: "Multi-model brain MRI screening",
    status: "Built for the Google Research MedGemma Impact Challenge 2026",
    desc: "A 7-model pipeline screening brain MRIs for lesions, tumors, and silent strokes. Full scan analysis in under 60 seconds, built for the Google Research MedGemma Impact Challenge 2026.",
    tech: ["PyTorch", "3D CNN", "MONAI", "Streamlit"],
    link: "https://github.com/Shravaniroyal/brainGuard-ai",
    detail: {
      problem:
        "Reading brain MRIs for subtle findings such as small lesions and silent strokes is slow and depends heavily on specialist time. BrainGuard AI screens a scan for several conditions in one pass, so findings can be flagged quickly for clinical review.",
      approach: [
        "A pipeline of 7 models, each handling a different screening task (lesions, tumors, silent strokes).",
        "3D CNNs built with PyTorch and MONAI, working on volumetric MRI data.",
        "Streamlit interface for uploading a scan and viewing the results.",
      ],
      build: [
        "Input: a brain MRI volume uploaded through the Streamlit interface.",
        "Preparation: the scan is loaded and prepared as a 3D volume, using MONAI tools built for medical imaging.",
        "Analysis: seven separate models each look at one question, such as lesions, tumors, silent strokes and brain age, and their findings are put together.",
        "Models: 3D convolutional networks written in PyTorch that read the whole volume instead of single slices.",
        "Speed: a full scan is analysed in under 60 seconds.",
        "Output: a combined screening summary that a clinician can review.",
      ],
      results: [
        { label: "Models in pipeline", value: "7" },
        { label: "Full scan analysis", value: "Under 60 seconds" },
        { label: "Estimated screening cost", value: "About 75x lower than an MRI plus specialist visit" },
      ],
      future: [
        "Work with medical labs and hospitals: she plans to collaborate with labs and hospitals to get real, real-time scan data, under proper data-sharing agreements and ethics approval, with patient data de-identified.",
        "Validate on real cases: compare the pipeline's findings with radiologists' reports, measure sensitivity and false alarms, and check it across different scanners, hospitals and patient groups.",
        "Connect to hospital systems: read scans directly from the imaging systems labs already use (DICOM and PACS), so no one has to upload files by hand.",
        "Learn from feedback: let doctors confirm or correct each finding, and use that feedback to improve the models.",
        "Protect patient privacy: explore training that keeps data inside each hospital, such as federated learning, so scans do not have to be sent out.",
        "Clinical approval: seek the regulatory approvals needed for medical software before any clinical use.",
      ],
      government: [
        "Screening where specialists are scarce: district hospitals and primary health centres could use it to flag scans for urgent review, with results sent to a remote radiologist.",
        "Public health programmes: it could support national digital health efforts and telemedicine services, helping to prioritise patients and shorten waiting times.",
        "Lower cost: if validated, screening at a fraction of the usual cost could make brain imaging reach more people.",
        "Population insights: anonymised, aggregated findings could help health departments plan resources.",
        "It would need clinical validation and regulatory approval first.",
      ],
      notes: [
        "A screening aid for research and demonstration, not a diagnostic tool.",
        "The future items above are plans, not features that exist today.",
      ],
    },
  },
  {
    slug: "ai-stock-intelligence",
    title: "AI Stock Intelligence",
    subtitle: "Multi-agent financial analysis",
    status: "Completed",
    desc: "A 4-agent system covering NSE, BSE, NYSE and NASDAQ, pulling market data, news and sentiment into a 30-day BUY/HOLD/SELL suggestion.",
    tech: ["CrewAI", "Gemini", "Yahoo Finance API"],
    link: "https://github.com/Shravaniroyal/stock-intelligence-agent",
    detail: {
      problem:
        "Judging a stock means combining price data, news and market sentiment across several exchanges, which is tedious to do by hand. This project splits that work across cooperating AI agents and combines their findings into one suggestion.",
      approach: [
        "Four agents orchestrated with CrewAI, each responsible for one part of the analysis.",
        "Market data pulled from the Yahoo Finance API, with news and sentiment analysed by Gemini.",
        "Covers four exchanges: NSE, BSE, NYSE and NASDAQ.",
        "The agents' outputs are combined into a 30-day BUY, HOLD or SELL suggestion.",
      ],
      build: [
        "Orchestration: CrewAI coordinates four agents, each with its own task and tools.",
        "Market data: prices and fundamentals come from the Yahoo Finance API for stocks on NSE, BSE, NYSE and NASDAQ.",
        "News and sentiment: Gemini reads news and Reddit discussion and summarises the mood around a stock.",
        "Synthesis: the final agent weighs the other agents' findings and writes a 30-day BUY, HOLD or SELL suggestion with reasons.",
        "It is an analysis tool and does not place trades.",
      ],
      results: [
        { label: "Agents", value: "4" },
        { label: "Exchanges", value: "NSE, BSE, NYSE, NASDAQ" },
        { label: "Forecast window", value: "30 days" },
      ],
      future: [
        "Test it properly: backtest suggestions against past prices and report how often they were right.",
        "Add more agents, such as company fundamentals, sector and macro-economic conditions, and risk.",
        "Show sources: link every claim to the news or data it came from, so users can check it.",
        "Add portfolio views, alerts and a web dashboard.",
      ],
      government: [
        "Investor education: it could be adapted into a teaching tool for financial-literacy programmes, showing how data and news feed into an investment view.",
        "Market awareness: regulators and exchanges could study aggregated sentiment patterns, for example to spot unusual hype around a stock.",
        "Any public use would need strong safeguards, because a wrong suggestion has real financial consequences.",
      ],
      notes: [
        "An educational project. Its output is not financial advice.",
      ],
    },
  },
];

export const findProject = (slug) => PROJECTS.find((p) => p.slug === slug);
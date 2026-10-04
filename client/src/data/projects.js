// Single source of truth for project cards (Home) and detail pages (/projects/:slug).
// `link` is optional: when present, the card shows a "Code →" link to GitHub.

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
      results: [
        { label: "Test accuracy", value: "98.18%" },
        { label: "ROC-AUC", value: "0.9971" },
        { label: "Macro F1", value: "0.98" },
        { label: "Backbone latency (CPU)", value: "1.4 s" },
      ],
      notes: [
        "Results are from the Phase 2 prototype and are not a final, fully validated result.",
        "Phase 3: validate Grad-CAM against DocTamper masks, calibrate false positives on Indian documents, run ablations, and deploy as a web app.",
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
      results: [
        { label: "Published", value: "JETIR, Vol. 11, Issue 12, 2024" },
        { label: "Evaluation", value: "PSNR (quality) and BER (robustness)" },
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
      results: [
        { label: "Decision Tree", value: "89.3%" },
        { label: "Random Forest", value: "86.7%" },
        { label: "Logistic Regression", value: "84.0%" },
        { label: "KNN", value: "82.7%" },
        { label: "SVM", value: "79.3%" },
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
      results: [
        { label: "Models in pipeline", value: "7" },
        { label: "Full scan analysis", value: "Under 60 seconds" },
      ],
      notes: [
        "A screening aid for research and demonstration, not a diagnostic tool.",
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
      results: [
        { label: "Agents", value: "4" },
        { label: "Exchanges", value: "NSE, BSE, NYSE, NASDAQ" },
        { label: "Forecast window", value: "30 days" },
      ],
      notes: [
        "An educational project. Its output is not financial advice.",
      ],
    },
  },
];

export const findProject = (slug) => PROJECTS.find((p) => p.slug === slug);
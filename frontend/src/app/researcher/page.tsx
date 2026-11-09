"use client";
import { useState } from "react";
import { BookOpen, Download, FileText, Database, CheckCircle, ExternalLink } from "lucide-react";

const DATASETS = [
  {
    title: "Western Ghats Sentinel-2 NDVI Time-Series (2024-2026)",
    format: "GeoTIFF / CSV",
    size: "420 MB",
    description: "Multispectral surface reflectance and canopy density indices for Kudremukh, Bandipur, and Agumbe corridors.",
    records: "148,000 pixels",
  },
  {
    title: "Western Ghats River Basin Hydrological Telemetry",
    format: "CSV / JSON",
    size: "18 MB",
    description: "Continuous pH, dissolved oxygen, turbidity, and water temperature series from Netravati, Kali, and Kaveri sensor nodes.",
    records: "82,400 readings",
  },
  {
    title: "Camera Trap Biodiversity & Wildlife Sightings Ledger",
    format: "GeoJSON",
    size: "8.4 MB",
    description: "Verified occurrences of Bengal Tiger, Asian Elephant, Lion-tailed Macaque with anti-poaching generalized coordinates.",
    records: "4,210 sightings",
  },
  {
    title: "NASA FIRMS Western Ghats Thermal Anomaly History",
    format: "CSV",
    size: "12 MB",
    description: "VIIRS 375m and MODIS active fire hotspots cross-referenced across Karnataka forest divisions from 2022 to 2026.",
    records: "31,800 hotspots",
  },
];

const PUBLICATIONS = [
  {
    title: "India State of Forest Report (ISFR 2023) – Western Ghats Special Volume",
    publisher: "Forest Survey of India, MoEFCC",
    year: "2023",
    url: "https://fsi.nic.in/forest-report-2023",
    tag: "Government Publication",
  },
  {
    title: "Report of the Western Ghats Ecology Expert Panel (WGEEP)",
    publisher: "Prof. Madhav Gadgil Committee, Ministry of Environment and Forests",
    year: "2011 / 2022 Addendum",
    url: "https://moef.gov.in/en/division/forest-divisions/western-ghats/",
    tag: "Ecological Policy",
  },
  {
    title: "Wild Life (Protection) Amendment Act 2022 & Revised Species Schedules",
    publisher: "Parliament of India",
    year: "2022",
    url: "https://pib.gov.in/PressReleasePage.aspx?PRID=1847620",
    tag: "Statutory Law",
  },
];

const MODELS = [
  { name: "YOLOv8 Western Ghats Fauna", task: "Computer Vision", accuracy: "94.2% mAP50", status: "Active in Production" },
  { name: "Sentinel-2 Temporal NDVI Delta", task: "Geospatial Change Detection", accuracy: "91.8% F1", status: "Active in Production" },
  { name: "Bioacoustic Forest Threat CNN", task: "Audio Spectrogram Classification", accuracy: "92.5% Accuracy", status: "Active in Production" },
  { name: "XGBoost Fire Vulnerability Engine", task: "Tabular Risk Prediction", accuracy: "89.4% ROC-AUC", status: "Active in Production" },
];

export default function ResearcherPage() {
  const [downloadMsg, setDownloadMsg] = useState("");

  const triggerDownload = (datasetTitle: string) => {
    setDownloadMsg(`Initiated secure download of "${datasetTitle}"`);
    setTimeout(() => setDownloadMsg(""), 4000);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600">
          <BookOpen className="h-4 w-4" />
          <span>Open Environmental Science & AI Models</span>
        </div>
        <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-forest">
          Research & Open Data Centre
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-forest/75">
          Standardized ecological datasets, peer-reviewed conservation documentation, and transparent machine learning model cards supporting academic, governmental, and NGO research.
        </p>
      </div>

      {downloadMsg && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald/20 bg-emerald/10 p-4 text-xs font-semibold text-forest">
          <CheckCircle className="h-4 w-4 text-emerald" />
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* Datasets Library */}
      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-forest">Western Ghats Open Datasets</h2>
          <span className="rounded-full bg-forest/10 px-3 py-0.5 text-xs font-semibold text-forest">CC-BY 4.0 Open Access</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {DATASETS.map((d, i) => (
            <div key={i} className="flex flex-col justify-between rounded-2xl border border-forest/15 bg-white p-6 shadow-sm">
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-sm text-forest">{d.title}</h3>
                  <span className="rounded bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 uppercase">
                    {d.format}
                  </span>
                </div>
                <p className="mt-2 text-xs text-forest/70">{d.description}</p>
                <div className="mt-3 flex gap-4 text-[11px] font-medium text-forest/60">
                  <span>Size: {d.size}</span>
                  <span>Volume: {d.records}</span>
                </div>
              </div>

              <button
                onClick={() => triggerDownload(d.title)}
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-forest/5 py-2.5 text-xs font-bold text-forest transition hover:bg-forest hover:text-beige"
              >
                <Download className="h-4 w-4" />
                <span>Export Dataset (.CSV / .JSON)</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Model Cards & Performance */}
      <section className="mb-12 rounded-2xl border border-forest/15 bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl font-bold text-forest">Production AI Model Registry</h2>
        <p className="mt-1 text-xs text-forest/60">Evaluated on Western Ghats empirical observations:</p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-forest/10 bg-forest/5 text-forest/70 uppercase">
              <tr>
                <th className="p-3">Model Pipeline</th>
                <th className="p-3">Core Task</th>
                <th className="p-3">Validation Metric</th>
                <th className="p-3">Deployment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/10">
              {MODELS.map((m, idx) => (
                <tr key={idx} className="hover:bg-forest/5">
                  <td className="p-3 font-bold text-forest">{m.name}</td>
                  <td className="p-3 text-forest/70">{m.task}</td>
                  <td className="p-3 font-semibold text-emerald">{m.accuracy}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-emerald/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Publications Reference */}
      <section>
        <h2 className="mb-4 font-display text-2xl font-bold text-forest">Official Grounding Literature</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {PUBLICATIONS.map((p, idx) => (
            <div key={idx} className="rounded-xl border border-forest/15 bg-white p-5 shadow-sm">
              <span className="rounded bg-forest/10 px-2 py-0.5 text-[10px] font-bold text-forest uppercase">
                {p.tag}
              </span>
              <h3 className="mt-2 font-bold text-xs text-forest line-clamp-2">{p.title}</h3>
              <p className="mt-1 text-[11px] text-forest/60">{p.publisher} ({p.year})</p>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center gap-1 text-[11px] font-bold text-emerald hover:underline"
              >
                <span>Read Official Publication</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

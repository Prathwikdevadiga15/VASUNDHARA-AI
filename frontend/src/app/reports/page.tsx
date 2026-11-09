"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { listReports, submitReport } from "@/services/reports";
import type { Report, ReportCategory } from "@/types";
import { ShieldAlert, MapPin, CheckCircle, Languages, AlertTriangle, Upload, Clock } from "lucide-react";

const MapPicker = dynamic(() => import("@/components/maps/ReportMap"), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse rounded-xl bg-forest/5" />,
});

const TRANSLATIONS = {
  en: {
    title: "JanRakshak: Citizen Conservation Portal",
    subtitle: "Empowering communities to report environmental threats before irreversible damage occurs.",
    reportBtn: "Submit Geotagged Report",
    categoryLabel: "Threat Category",
    descLabel: "Incident Description",
    coordsLabel: "Coordinates (Click Map to Pin)",
    historyTitle: "Community Incident Tracking Ledger",
    successMsg: "Your environmental incident report has been submitted for Forest Ranger investigation.",
    categories: {
      illegal_logging: "Illegal Timber Logging / Tree Felling",
      forest_fire: "Forest Fire / Smoke Plume",
      poaching: "Poaching Snare / Trap Detected",
      water_pollution: "Water Contamination / Effluent Discharge",
      wildlife_distress: "Wildlife Injury / Animal Distress",
      other: "General Environmental Hazard",
    },
  },
  kn: {
    title: "ಜನರಕ್ಷಕ: ಸಮುದಾಯ ಪರಿಸರ ಸಂರಕ್ಷಣಾ ವೇದಿಕೆ",
    subtitle: "ಪರಿಸರ ಹಾನಿಯನ್ನು ತಡೆಯಲು ನಾಗರಿಕರು ನೇರವಾಗಿ ಅರಣ್ಯ ಇಲಾಖೆಗೆ ದೂರು ದಾಖಲಿಸುವ ವ್ಯವಸ್ಥೆ.",
    reportBtn: "ವರದಿ ಸಲ್ಲಿಸಿ",
    categoryLabel: "ಘಟನೆಯ ವಿಧ",
    descLabel: "ಘಟನೆಯ ವಿವರ",
    coordsLabel: "ಸ್ಥಳದ ನಿರ್ದೇಶಾಂಕಗಳು (ನಕ್ಷೆಯಲ್ಲಿ ಆಯ್ಕೆಮಾಡಿ)",
    historyTitle: "ದಾಖಲಾದ ದೂರುಗಳ ಪ್ರಗತಿ ವರದಿ",
    successMsg: "ನಿಮ್ಮ ದೂರನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ. ಅರಣ್ಯ ಅಧಿಕಾರಿಗಳ ಪರಿಶೀಲನೆಗೆ ರವಾನಿಸಲಾಗಿದೆ.",
    categories: {
      illegal_logging: "ಅಕ್ರಮ ಮರ ಕಡಿತ",
      forest_fire: "ಕಾಡ್ಗಿಚ್ಚು / ಹೊಗೆ ಕಾಣಿಸುವುದು",
      poaching: "ಪ್ರಾಣಿ ಬೇಟೆ / ಉರುಳು ಹಾಕಿರುವುದು",
      water_pollution: "ನದಿ ನೀರು ಕಲುಷಿತಗೊಳಿಸುವುದು",
      wildlife_distress: "ವನ್ಯಜೀವಿಗಳಿಗೆ ಗಾಯ / ತೊಂದರೆ",
      other: "ಇತರ ಪರಿಸರ ಹಾನಿ",
    },
  },
  hi: {
    title: "जनरक्षक: नागरिक पर्यावरण संरक्षण पोर्टल",
    subtitle: "पर्यावरण क्षति को रोकने के लिए नागरिकों द्वारा त्वरित भू-टैग्ड रिपोर्टिंग प्रणाली।",
    reportBtn: "रिपोर्ट दर्ज करें",
    categoryLabel: "घटना की श्रेणी",
    descLabel: "घटना का विवरण",
    coordsLabel: "स्थान के निर्देशांक (मानचित्र पर चुनें)",
    historyTitle: "नागरिक शिकायतों की लाइव स्थिति",
    successMsg: "आपकी रिपोर्ट सफलतापूर्वक दर्ज कर ली गई है और वन अधिकारियों को भेज दी गई है।",
    categories: {
      illegal_logging: "अवैध पेड़ कटाई",
      forest_fire: "जंगल की आग / धुआं",
      poaching: "अवैध शिकार / फंदा",
      water_pollution: "नदी जल प्रदूषण",
      wildlife_distress: "घायल वन्यजीव संकट",
      other: "अन्य पर्यावरण खतरा",
    },
  },
};

export default function ReportsPage() {
  const [lang, setLang] = useState<"en" | "kn" | "hi">("en");
  const t = TRANSLATIONS[lang];

  const [category, setCategory] = useState<ReportCategory>("illegal_logging");
  const [description, setDescription] = useState("");
  const [coords, setCoords] = useState<[number, number]>([13.218, 75.257]); // Default Kudremukh
  const [reports, setReports] = useState<Report[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadReports = async () => {
    try {
      const data = await listReports();
      setReports(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || submitting) return;

    setSubmitting(true);
    setSuccess(false);

    try {
      await submitReport({
        category,
        description,
        latitude: coords[0],
        longitude: coords[1],
      });
      setSuccess(true);
      setDescription("");
      await loadReports();
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Header with Language Selector */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald">
            <ShieldAlert className="h-4 w-4" />
            <span>JanRakshak Community Conservation Portal</span>
          </div>
          <h1 className="mt-1 font-display text-4xl font-bold tracking-tight text-forest">{t.title}</h1>
          <p className="mt-1 text-xs sm:text-sm text-forest/75">{t.subtitle}</p>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 rounded-xl border border-forest/15 bg-white p-1.5 shadow-xs">
          <Languages className="ml-1 h-4 w-4 text-forest/60" />
          <button
            onClick={() => setLang("en")}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
              lang === "en" ? "bg-forest text-beige" : "text-forest/70 hover:text-forest"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang("kn")}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
              lang === "kn" ? "bg-forest text-beige" : "text-forest/70 hover:text-forest"
            }`}
          >
            ಕನ್ನಡ
          </button>
          <button
            onClick={() => setLang("hi")}
            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition ${
              lang === "hi" ? "bg-forest text-beige" : "text-forest/70 hover:text-forest"
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-2xl border border-forest/15 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-bold text-forest">Report Environmental Incident</h2>
          <p className="mt-1 text-xs text-forest/60">Provide geo-tagged telemetry to dispatch forest rangers:</p>

          {success && (
            <div className="my-4 flex items-center gap-2 rounded-xl border border-emerald/20 bg-emerald/10 p-3 text-xs font-medium text-forest">
              <CheckCircle className="h-4 w-4 text-emerald shrink-0" />
              <span>{t.successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest/80">
                {t.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ReportCategory)}
                className="mt-1 w-full rounded-xl border border-forest/20 bg-forest/5 p-3 text-xs font-semibold text-forest focus:outline-none focus:ring-2 focus:ring-emerald"
              >
                {Object.entries(t.categories).map(([k, label]) => (
                  <option key={k} value={k}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest/80">
                {t.descLabel}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Describe exact landmarks, observable smoke, vehicle numbers or tree species affected..."
                className="mt-1 w-full rounded-xl border border-forest/20 bg-forest/5 p-3 text-xs text-forest focus:outline-none focus:ring-2 focus:ring-emerald"
                required
              />
            </div>

            <div>
              <div className="mb-1 flex justify-between text-xs font-bold text-forest/80">
                <span>{t.coordsLabel}</span>
                <span className="font-mono text-emerald">
                  {coords[0].toFixed(4)}°N, {coords[1].toFixed(4)}°E
                </span>
              </div>
              <MapPicker
                reports={reports}
                picked={coords}
                onPick={(lat, lng) => setCoords([lat, lng])}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-forest py-3 text-xs font-bold text-beige shadow transition hover:bg-forest/90 disabled:opacity-50"
            >
              {submitting ? "Submitting to Forest Department..." : t.reportBtn}
            </button>
          </form>
        </div>

        {/* Ledger */}
        <div className="rounded-2xl border border-forest/15 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-forest/10 pb-4">
            <h2 className="font-display text-xl font-bold text-forest">{t.historyTitle}</h2>
            <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-xs font-semibold text-forest">
              {reports.length} Reports Logged
            </span>
          </div>

          <div className="mt-4 space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {reports.map((r) => (
              <div key={r.id} className="rounded-xl border border-forest/15 bg-forest/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs capitalize text-forest">
                    {r.category.replace("_", " ")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      r.status === "verified" || r.status === "resolved"
                        ? "bg-green-100 text-green-700"
                        : r.status === "investigating"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-forest/80">{r.description}</p>
                <div className="mt-3 flex items-center justify-between text-[10px] text-forest/60">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  </span>
                  <span className="font-mono">
                    {r.latitude.toFixed(3)}°N, {r.longitude.toFixed(3)}°E
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

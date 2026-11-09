import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/navbar/Navbar";
import { Trees, ShieldCheck, Heart, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "VASUNDHARA AI | Predictive Biodiversity & Ecosystem Protection Network",
  description:
    "India's premier environmental intelligence network for the Western Ghats. Sentinel-2 NDVI canopy monitoring, YOLOv8 fauna computer vision, bioacoustic threat classification, XGBoost fire risk early warning, and zero-hallucination RAG assistant.",
  keywords: [
    "Vasundhara AI",
    "Western Ghats Biodiversity",
    "ForestWatch AI",
    "BioTrack AI",
    "AquaGuard AI",
    "EcoPredict AI",
    "Karnataka Forest Department",
    "Wildlife Protection",
    "Sentinel-2 NDVI",
    "Environmental Intelligence",
    "RAG AI Assistant",
    "National Hackathon",
  ],
  authors: [{ name: "The Vasundhara Initiative Team" }],
  creator: "Vasundhara AI Engineering",
  publisher: "The Vasundhara Initiative",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://vasundhara-ai.gov.in",
    title: "VASUNDHARA AI – Protecting Nature Before It Is Too Late",
    description:
      "Multispectral satellite canopy analysis, bioacoustic chainsaw detection, endangered fauna tracking, and community incident triage for India's natural heritage.",
    siteName: "VASUNDHARA AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "VASUNDHARA AI – Predictive Biodiversity & Ecosystem Protection",
    description: "Defending Western Ghats biodiversity with computer vision, satellite telemetry, and AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "GovernmentService",
      "name": "VASUNDHARA AI Environmental Intelligence Network",
      "serviceType": "Predictive Biodiversity and Ecosystem Protection",
      "provider": {
        "@type": "GovernmentOrganization",
        "name": "Karnataka Forest Department & MoEFCC",
      },
      "areaServed": "Western Ghats, Karnataka, India",
      "description":
        "Unified ecological surveillance system synthesizing Sentinel-2 MSI satellite reflectance, bioacoustic audio threat detection, and citizen verified incident response.",
    },
    {
      "@type": "SoftwareApplication",
      "name": "VASUNDHARA AI",
      "applicationCategory": "Environmental Intelligence Platform",
      "operatingSystem": "Web, Mobile Responsive",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-beige font-sans text-forest antialiased flex flex-col justify-between selection:bg-emerald selection:text-white">
        <AuthProvider>
          <div>
            <Navbar />
            {children}
          </div>

          {/* Universal Footer */}
          <footer className="mt-20 border-t border-forest/15 bg-white/70 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                {/* Col 1: Brand & Pilot Region */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest text-beige">
                      <Trees className="h-5 w-5 text-emerald" />
                    </div>
                    <span className="font-display text-lg font-bold text-forest">VASUNDHARA AI</span>
                  </div>
                  <p className="text-xs text-forest/75 leading-relaxed">
                    Pilot Region: Western Ghats, Karnataka. An open ecological intelligence network defending India's natural wealth through predictive machine learning, satellite telemetry, and accountable governance.
                  </p>
                  <div className="pt-1 text-[11px] font-semibold text-emerald flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald animate-pulse" />
                    <span>Real-time Sentinel-2 & NASA FIRMS Sync Active</span>
                  </div>
                </div>

                {/* Col 2: AI Intelligence */}
                <div>
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-forest mb-3">
                    AI Modules
                  </h4>
                  <ul className="space-y-2 text-xs text-forest/80 font-medium">
                    <li>
                      <Link href="/forestwatch" className="hover:text-emerald transition">
                        ForestWatch AI – Canopy Loss
                      </Link>
                    </li>
                    <li>
                      <Link href="/biotrack" className="hover:text-emerald transition">
                        BioTrack AI – Fauna CV & Audio
                      </Link>
                    </li>
                    <li>
                      <Link href="/aquaguard" className="hover:text-emerald transition">
                        AquaGuard AI – River Telemetry
                      </Link>
                    </li>
                    <li>
                      <Link href="/ecopredict" className="hover:text-emerald transition">
                        EcoPredict AI – XGBoost Fire Danger
                      </Link>
                    </li>
                    <li>
                      <Link href="/assistant" className="hover:text-emerald transition">
                        RAG Knowledge Assistant
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 3: Field Portals */}
                <div>
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-forest mb-3">
                    Action Portals
                  </h4>
                  <ul className="space-y-2 text-xs text-forest/80 font-medium">
                    <li>
                      <Link href="/reports" className="hover:text-emerald transition">
                        JanRakshak Citizen Reporting
                      </Link>
                    </li>
                    <li>
                      <Link href="/officer" className="hover:text-emerald transition">
                        Officer Incident Verification
                      </Link>
                    </li>
                    <li>
                      <Link href="/researcher" className="hover:text-emerald transition">
                        Ecological Research Center
                      </Link>
                    </li>
                    <li>
                      <Link href="/ngo" className="hover:text-emerald transition">
                        NGO & Volunteer Campaigns
                      </Link>
                    </li>
                    <li>
                      <Link href="/admin/dashboard" className="hover:text-emerald transition">
                        System Security & Audit Logs
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Col 4: Official Data Sources */}
                <div>
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-forest mb-3">
                    Knowledge Grounding
                  </h4>
                  <p className="text-[11px] text-forest/75 leading-relaxed mb-3">
                    All predictive models ground their evidence in verified Indian statutory sources:
                  </p>
                  <ul className="space-y-1.5 text-[11px] text-forest/70">
                    <li className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3 text-emerald flex-shrink-0" />
                      <span>Forest Survey of India (ISFR 2023)</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3 text-emerald flex-shrink-0" />
                      <span>Wildlife Protection Act 1972</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3 text-emerald flex-shrink-0" />
                      <span>NASA FIRMS VIIRS Active Fire Hotspots</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 border-t border-forest/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-forest/60">
                <p>© 2026 VASUNDHARA AI Initiative. Protecting Nature Before It Is Too Late.</p>
                <div className="flex items-center gap-4">
                  <Link href="/auth" className="hover:text-forest transition">
                    Access Portal
                  </Link>
                  <span>•</span>
                  <a
                    href="http://localhost:8000/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-forest transition flex items-center gap-1"
                  >
                    <span>OpenAPI Spec</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

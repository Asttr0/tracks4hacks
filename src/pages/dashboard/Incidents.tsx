import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, ShieldCheck, Target, Layers, Clock,
  CheckCircle2, AlertCircle, Sparkles, Download, FileSearch,
} from "lucide-react";
import { PageHeader } from "../../components/ui/PageHeader";
import {
  PrintableReport,
  DEMO_KPI,
  DEMO_DETECTED,
  DEMO_MISSED,
} from "./Coverage";

export default function Incidents() {
  const [hovered, setHovered] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState(false);

  const noRuleCount  = DEMO_MISSED.filter((a) => a.missReason === "NO_RULE").length;
  const timeoutCount = DEMO_MISSED.filter((a) => a.missReason === "TIMEOUT").length;

  const handleExport = () => {
    setGenerating(true);
    setTimeout(() => {
      window.print();
      setGenerating(false);
      setToast(true);
      setTimeout(() => setToast(false), 2200);
    }, 600);
  };

  const reportSections = [
    { icon: Target,        label: "Indicateurs Clés",       desc: "Taux de détection, MTTD, angles morts",      color: "#0ea5e9" },
    { icon: CheckCircle2,  label: "Preuves de Corrélation", desc: "Chaque ATK ↔ ALR avec commande & règle",     color: "#16a34a" },
    { icon: AlertCircle,   label: "Angles Morts",           desc: "Attaques manquées par cause classifiée",     color: "#dc2626" },
    { icon: Layers,        label: "Répartition par Outil",  desc: "Stats par outil Red Team & délai moyen",     color: "#a855f7" },
    { icon: FileText,      label: "Charges Utiles",         desc: "Commandes des angles morts (base de règles)", color: "#f97316" },
  ];

  return (
    <>
      {/* Print CSS — hides everything except .print-report */}
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 12mm 14mm; }
          html, body { background: white !important; margin: 0 !important; padding: 0 !important; }
          body * { visibility: hidden !important; }
          .print-report, .print-report * { visibility: visible !important; }
          .print-report {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: #0f172a !important;
          }
          .print-report table { page-break-inside: auto; }
          .print-report tr { page-break-inside: avoid; page-break-after: auto; }
          .print-report .detected-card { page-break-inside: avoid; break-inside: avoid; }
          .print-report h2 { page-break-after: avoid; break-after: avoid; }
        }
      `}</style>

      <div className="space-y-8">
        <PageHeader
          eyebrow="● Incidents — Reporting"
          title="Rapport d'Incident"
          description="Génère un rapport PDF complet à partir de la dernière session Red Team / Wazuh — preuves de corrélation, angles morts et charges utiles."
        />

        {/* ── HERO CARD ─────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 p-8 shadow-sm dark:border-white/[0.08] dark:from-black/40 dark:via-black/30 dark:to-night-bordeaux-950/20 dark:shadow-none dark:backdrop-blur-sm lg:p-10"
        >
          {/* Animated gradient blob */}
          <motion.div
            aria-hidden
            animate={{
              x: hovered ? [0, 30, 0] : 0,
              y: hovered ? [0, -20, 0] : 0,
              scale: hovered ? [1, 1.15, 1] : 1,
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-gradient-to-br from-red-200/40 via-orange-200/30 to-transparent blur-3xl dark:from-night-bordeaux-500/20 dark:via-orange-500/10"
          />
          <motion.div
            aria-hidden
            animate={{
              x: hovered ? [0, -25, 0] : 0,
              y: hovered ? [0, 15, 0] : 0,
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -bottom-24 -left-12 size-72 rounded-full bg-gradient-to-tr from-blue-200/30 via-cyan-200/20 to-transparent blur-3xl dark:from-blue-500/15 dark:via-cyan-500/10"
          />

          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            {/* Left — description */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <Sparkles size={11} className="text-night-bordeaux-500 dark:text-night-bordeaux-400" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-600 dark:text-coffee-bean-100/80">
                  Rapport prêt à partager
                </span>
              </div>

              <h2 className="font-cinematic text-3xl uppercase tracking-[0.04em] text-slate-900 dark:text-coffee-bean-50 lg:text-4xl">
                Un clic. Un rapport.
              </h2>
              <p className="mt-4 max-w-xl font-mono text-sm leading-relaxed text-slate-600 dark:text-coffee-bean-100/80">
                Génère un <strong className="text-slate-900 dark:text-coffee-bean-50">rapport PDF d'incident</strong> à remettre à ta direction après un exercice. Toutes les données du <em>Coverage Scoreboard</em> sont consolidées : indicateurs clés, preuves de corrélation Red Team ↔ Wazuh, angles morts et commandes manquées.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 max-w-md">
                {[
                  { icon: ShieldCheck, label: "Audit-ready",  sub: "Format SOC pro" },
                  { icon: FileSearch,  label: "Détaillé",     sub: "Preuves complètes" },
                  { icon: Layers,      label: "Structuré",    sub: "5 sections claires" },
                  { icon: Clock,       label: "Instantané",   sub: "< 1 seconde" },
                ].map((f, i) => (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.35 }}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-200/70 bg-white/60 px-3 py-2 backdrop-blur-sm dark:border-white/[0.06] dark:bg-white/[0.03]"
                  >
                    <f.icon size={14} className="shrink-0 text-night-bordeaux-500 dark:text-night-bordeaux-400" />
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[10px] font-bold uppercase tracking-widest text-slate-700 dark:text-coffee-bean-50">{f.label}</p>
                      <p className="truncate font-mono text-[9px] text-slate-400 dark:text-coffee-bean-200/45">{f.sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right — animated CTA */}
            <div className="flex flex-col items-center justify-center gap-5">
              <motion.button
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={handleExport}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={generating}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-night-bordeaux-300/60 bg-gradient-to-br from-night-bordeaux-500 via-red-600 to-night-bordeaux-700 px-8 py-4 font-mono text-xs font-bold uppercase tracking-[0.22em] text-white shadow-[0_10px_40px_-10px_rgba(196,59,59,0.6)] transition-shadow hover:shadow-[0_18px_55px_-10px_rgba(196,59,59,0.85)] disabled:opacity-70 dark:border-night-bordeaux-400/40"
              >
                {/* Shimmer sweep */}
                <motion.span
                  aria-hidden
                  className="absolute inset-y-0 -left-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ left: ["-50%", "150%"] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 }}
                />
                <AnimatePresence mode="wait">
                  {generating ? (
                    <motion.span
                      key="gen"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="relative flex items-center gap-3"
                    >
                      <motion.span
                        className="size-3 rounded-full border-2 border-white/40 border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                      />
                      Génération…
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="relative flex items-center gap-3"
                    >
                      <motion.span
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Download size={16} />
                      </motion.span>
                      Exporter le rapport PDF
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/40">
                <span className="size-1 rounded-full bg-green-500" />
                <span>{DEMO_DETECTED.length} détectées</span>
                <span className="opacity-30">·</span>
                <span className="size-1 rounded-full bg-red-500" />
                <span>{DEMO_MISSED.length} manquées</span>
                <span className="opacity-30">·</span>
                <span>format A4</span>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center font-mono text-[10px] leading-relaxed text-slate-400 dark:text-coffee-bean-200/40 max-w-[260px]"
              >
                Choisir <span className="text-slate-600 dark:text-coffee-bean-100/70">« Enregistrer en PDF »</span> comme destination.
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* ── SECTIONS PREVIEW ──────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-white/5">
              <FileText size={15} className="text-slate-700 dark:text-coffee-bean-100" />
            </div>
            <div>
              <p className="font-cinematic text-sm uppercase tracking-[0.22em] text-slate-900 dark:text-coffee-bean-50">Contenu du rapport</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-slate-400 dark:text-coffee-bean-200/35">5 sections · 2 pages A4</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {reportSections.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.07, ease: [0.32, 0.72, 0, 1] }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-slate-300 hover:shadow-md dark:border-white/[0.06] dark:bg-black/30 dark:hover:border-white/[0.12] dark:hover:shadow-none dark:hover:bg-black/40 dark:backdrop-blur-sm"
              >
                <div
                  className="absolute inset-x-0 top-0 h-0.5 transition-opacity opacity-0 group-hover:opacity-100"
                  style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }}
                />
                <p className="font-mono text-[9px] uppercase tracking-widest text-slate-300 dark:text-coffee-bean-200/25">§ {i + 1}</p>
                <div
                  className="mt-2 flex size-9 items-center justify-center rounded-xl border"
                  style={{ borderColor: `${s.color}30`, background: `${s.color}10` }}
                >
                  <s.icon size={15} style={{ color: s.color }} />
                </div>
                <p className="mt-3 font-cinematic text-xs uppercase tracking-[0.18em] text-slate-900 dark:text-coffee-bean-50">{s.label}</p>
                <p className="mt-1 font-mono text-[10px] leading-relaxed text-slate-500 dark:text-coffee-bean-200/55">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </div>

      {/* Toast — confirmation après génération */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-green-200 bg-white px-5 py-3.5 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)] dark:border-green-500/25 dark:bg-black/85 dark:shadow-[0_12px_40px_-8px_rgba(34,197,94,0.25)] dark:backdrop-blur-md"
            style={{ visibility: "visible" }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.08, type: "spring", stiffness: 280, damping: 16 }}
              className="flex size-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/15"
            >
              <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
            </motion.div>
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-slate-900 dark:text-coffee-bean-50">
                Rapport généré
              </p>
              <p className="mt-0.5 font-mono text-[9px] tracking-wider text-slate-400 dark:text-coffee-bean-200/45">
                Vérifie ton dossier de téléchargements
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The actual printable report — hidden on screen, revealed by print CSS */}
      <PrintableReport
        kpi={DEMO_KPI}
        detected={DEMO_DETECTED}
        missed={DEMO_MISSED}
        noRuleCount={noRuleCount}
        timeoutCount={timeoutCount}
      />
    </>
  );
}

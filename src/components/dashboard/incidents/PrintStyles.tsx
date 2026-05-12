export const PrintStyles = () => (
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
);

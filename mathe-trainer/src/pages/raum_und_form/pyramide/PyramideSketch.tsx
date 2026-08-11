const strokeColor = "#0f172a";
const fillColor = "#e2e8f0";
const accentColor = "#ef7b10";

export default function PyramideSketch({ side, height, unit }: { side: number; height: number; unit: string }) {
  return (
    <svg viewBox="0 0 220 160" className="w-full max-w-[220px] h-40 mx-auto" role="img" aria-label="Pyramide">
      <polygon points="60,110 160,110 190,130 30,130" fill={fillColor} stroke={strokeColor} strokeWidth={2} />
      <line x1="110" y1="20" x2="60" y2="110" stroke={strokeColor} strokeWidth={2} />
      <line x1="110" y1="20" x2="160" y2="110" stroke={strokeColor} strokeWidth={2} />
      <line x1="110" y1="20" x2="190" y2="130" stroke={strokeColor} strokeWidth={2} />
      <line x1="110" y1="20" x2="30" y2="130" stroke={strokeColor} strokeWidth={2} />
      <line x1="110" y1="20" x2="110" y2="120" stroke={accentColor} strokeWidth={2} strokeDasharray="4 4" />
      <text x="105" y="145" textAnchor="middle" className="fill-slate-600 text-xs">{`a = ${side} ${unit}`}</text>
      <text x="118" y="70" className="fill-slate-600 text-xs">{`h = ${height} ${unit}`}</text>
    </svg>
  );
}

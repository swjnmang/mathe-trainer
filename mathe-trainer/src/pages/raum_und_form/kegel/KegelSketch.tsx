const strokeColor = "#0f172a";
const fillColor = "#e2e8f0";
const accentColor = "#ef7b10";

export default function KegelSketch({ radius, height, unit }: { radius: number; height: number; unit: string }) {
  return (
    <svg viewBox="0 0 220 170" className="w-full max-w-[220px] h-44 mx-auto" role="img" aria-label="Kegel">
      <path d="M110 30 L40 130 Q110 150 180 130 Z" fill={fillColor} stroke={strokeColor} strokeWidth={2} />
      <line x1="110" y1="30" x2="110" y2="132" stroke={accentColor} strokeWidth={2} strokeDasharray="4 4" />
      <line x1="110" y1="30" x2="40" y2="130" stroke={strokeColor} strokeWidth={2} />
      <text x="118" y="80" className="fill-slate-600 text-xs">{`h = ${height} ${unit}`}</text>
      <text x="110" y="160" textAnchor="middle" className="fill-slate-600 text-xs">{`r = ${radius} ${unit}`}</text>
    </svg>
  );
}

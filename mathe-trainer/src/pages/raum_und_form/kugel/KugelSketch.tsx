const strokeColor = "#0f172a";
const fillColor = "#e2e8f0";
const accentColor = "#ef7b10";

export default function KugelSketch({ radius, unit }: { radius: number; unit: string }) {
  return (
    <svg viewBox="0 0 220 160" className="w-full max-w-[220px] h-40 mx-auto" role="img" aria-label="Kugel">
      <circle cx="110" cy="80" r="60" fill={fillColor} stroke={strokeColor} strokeWidth={2} />
      <ellipse cx="110" cy="80" rx="60" ry="18" fill="none" stroke={strokeColor} strokeWidth={1} strokeDasharray="3 3" />
      <line x1="110" y1="80" x2="170" y2="80" stroke={accentColor} strokeWidth={2} />
      <circle cx="110" cy="80" r="3" fill={strokeColor} />
      <text x="140" y="72" className="fill-slate-600 text-xs">{`r = ${radius} ${unit}`}</text>
    </svg>
  );
}

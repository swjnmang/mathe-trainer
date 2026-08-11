const strokeColor = "#0f172a";
const fillColor = "#e2e8f0";
const accentColor = "#ef7b10";

export default function ZylinderSketch({
  radius,
  height,
  unit,
  radiusKnown = true,
  heightKnown = true,
}: {
  radius: number;
  height: number;
  unit: string;
  radiusKnown?: boolean;
  heightKnown?: boolean;
}) {
  return (
    <svg viewBox="0 0 220 180" className="w-full max-w-[220px] h-44 mx-auto" role="img" aria-label="Zylinder">
      <rect x="50" y="40" width="120" height="100" fill={fillColor} stroke={strokeColor} strokeWidth={2} />
      <ellipse cx="110" cy="140" rx="60" ry="20" fill={fillColor} stroke={strokeColor} strokeWidth={2} />
      <ellipse cx="110" cy="40" rx="60" ry="20" fill={fillColor} stroke={strokeColor} strokeWidth={2} />
      <line x1="110" y1="40" x2="110" y2="140" stroke={accentColor} strokeWidth={2} strokeDasharray="4 4" />
      <line x1="110" y1="40" x2="170" y2="40" stroke={accentColor} strokeWidth={2} />
      <text x="128" y="95" className="fill-slate-600 text-xs">
        {heightKnown ? `h = ${height} ${unit}` : "h = ?"}
      </text>
      <text x="140" y="35" className="fill-slate-600 text-xs">
        {radiusKnown ? `r = ${radius} ${unit}` : "r = ?"}
      </text>
    </svg>
  );
}

const strokeColor = "#0f172a";
const fillColor = "#e2e8f0";
const accentColor = "#ef7b10";

export default function PrismaSketch({
  a,
  b,
  prismHeight,
  unit,
  aKnown = true,
  bKnown = true,
  heightKnown = true,
  hypotenuse,
  hypotenuseKnown = false,
}: {
  a: number;
  b: number;
  prismHeight: number;
  unit: string;
  aKnown?: boolean;
  bKnown?: boolean;
  heightKnown?: boolean;
  hypotenuse?: number;
  hypotenuseKnown?: boolean;
}) {
  return (
    <svg viewBox="0 0 220 170" className="w-full max-w-[220px] h-44 mx-auto" role="img" aria-label="Dreiecksprisma">
      <polygon points="70,90 200,90 220,30 50,30" fill="none" stroke={strokeColor} strokeWidth={2} strokeDasharray="4 4" />
      <polygon points="40,140 170,140 190,80 20,80" fill={fillColor} stroke={strokeColor} strokeWidth={2} />
      <line x1="40" y1="140" x2="70" y2="90" stroke={strokeColor} strokeWidth={2} />
      <line x1="170" y1="140" x2="200" y2="90" stroke={strokeColor} strokeWidth={2} />
      <line x1="20" y1="80" x2="50" y2="30" stroke={strokeColor} strokeWidth={2} />
      <line x1="190" y1="80" x2="220" y2="30" stroke={strokeColor} strokeWidth={2} />
      <line x1="35" y1="80" x2="35" y2="140" stroke={accentColor} strokeWidth={2} strokeDasharray="4 4" />
      <text x="105" y="155" textAnchor="middle" className="fill-slate-600 text-xs">
        {aKnown ? `a = ${a} ${unit}` : "a = ?"}
      </text>
      <text x="10" y="112" className="fill-slate-600 text-xs">
        {bKnown ? `b = ${b} ${unit}` : "b = ?"}
      </text>
      <text x="185" y="105" className="fill-slate-600 text-xs">
        {heightKnown ? `H = ${prismHeight} ${unit}` : "H = ?"}
      </text>
      {hypotenuse !== undefined && (
        <text x="95" y="115" className="fill-slate-600 text-xs">
          {hypotenuseKnown ? `c = ${hypotenuse} ${unit}` : "c = ?"}
        </text>
      )}
    </svg>
  );
}

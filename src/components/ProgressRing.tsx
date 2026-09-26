interface ProgressRingProps {
  value: number;
  label: string;
  size?: number;
}

export function ProgressRing({ value, label, size = 72 }: ProgressRingProps) {
  const safeValue = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
  const radius = 29;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="progress-ring" style={{ width: size, height: size }} aria-label={`${label}: ${Math.round(safeValue)}%`}>
      <svg viewBox="0 0 72 72" role="img" aria-hidden="true">
        <circle className="progress-ring__track" cx="36" cy="36" r={radius} />
        <circle
          className="progress-ring__value"
          cx="36"
          cy="36"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - safeValue / 100)}
        />
      </svg>
      <span>{label}</span>
    </div>
  );
}

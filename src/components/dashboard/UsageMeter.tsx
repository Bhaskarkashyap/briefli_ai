"use client";

interface UsageMeterProps {
  used: number;
  limit: number;
  label: string;
}

export function UsageMeter({ used, limit, label }: UsageMeterProps) {
  const percentage = limit === 0 ? 0 : Math.min((used / limit) * 100, 100);
  const isUnlimited = limit === 0;

  return (
    <div className="card p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-[var(--text-secondary)]">{label}</span>
        <span className="text-sm font-medium">
          {isUnlimited ? (
            <span className="text-[var(--success)]">Unlimited</span>
          ) : (
            <span>
              {used} / {limit}
            </span>
          )}
        </span>
      </div>
      <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            percentage > 80
              ? "bg-[var(--error)]"
              : percentage > 50
              ? "bg-[var(--warning)]"
              : "gradient-bg"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

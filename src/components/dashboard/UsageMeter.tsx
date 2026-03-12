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
        <span className="text-sm text-text-secondary">{label}</span>
        <span className="text-sm font-medium">
          {isUnlimited ? (
            <span className="text-success">Unlimited</span>
          ) : (
            <span>
              {used} / {limit}
            </span>
          )}
        </span>
      </div>
      <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            percentage > 80
              ? "bg-error"
              : percentage > 50
              ? "bg-warning"
              : "gradient-bg"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

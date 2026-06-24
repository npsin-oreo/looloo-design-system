import * as React from "react";

/** Labeled cell for variant / size / state galleries. */
export function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className="text-muted-foreground font-mono text-xs">{label}</span>
    </div>
  );
}

/** Horizontal wrapper that wraps gallery cells. */
export function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

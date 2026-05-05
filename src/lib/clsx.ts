type ClassValue = string | number | null | undefined | false | ClassValue[];

export const clsx = (...values: ClassValue[]): string => {
  const out: string[] = [];
  for (const v of values) {
    if (!v) continue;
    if (typeof v === "string" || typeof v === "number") out.push(String(v));
    else if (Array.isArray(v)) {
      const inner = clsx(...v);
      if (inner) out.push(inner);
    }
  }
  return out.join(" ");
};

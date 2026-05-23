export const formatKES = (n: number | string | null | undefined): string => {
  const num = typeof n === "string" ? parseFloat(n) : n ?? 0;
  if (isNaN(num as number)) return "0";
  return new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num as number);
};

export const formatDate = (d: string | Date | null | undefined): string => {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (isNaN(date.getTime())) return "—";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export const parseNumber = (v: string): number => {
  const cleaned = v.replace(/,/g, "").trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
};

export const parseSafeDate = (value?: string | null): Date | null => {
  if (!value) return null;

  // Case 1: ISO string (2026-04-21T16:54:22.230Z)
  const iso = new Date(value);
  if (!isNaN(iso.getTime())) return iso;

  // Case 2: dd/MM/yyyy HH:mm:ss
  const match = value.match(
    /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
  );

  if (match) {
    const [, d, m, y, h, min, s] = match;
    const normalized = new Date(`${y}-${m}-${d}T${h}:${min}:${s}`);
    if (!isNaN(normalized.getTime())) return normalized;
  }

  return null;
};

export function validateSize(value: string, min: number, max: number): boolean {
  const len = value.trim().length;
  return len >= min && len <= max;
}

export function validateGovernmentId(id: string): boolean {
  const regex = /^[0-9]{12}$/;
  return regex.test(id.trim());
}

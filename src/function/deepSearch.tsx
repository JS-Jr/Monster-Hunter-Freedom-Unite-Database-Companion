export default function deepSearch(value: unknown, search: string): boolean {
  if (value == null) return false;

  // strings
  if (typeof value === "string") {
    return value.toLowerCase().includes(search);
  }

  // numbers (optional but useful)
  if (typeof value === "number") {
    return value.toString().includes(search);
  }

  // arrays
  if (Array.isArray(value)) {
    return value.some((v) => deepSearch(v, search));
  }

  // objects
  if (typeof value === "object") {
    return Object.values(value).some((v) => deepSearch(v, search));
  }

  return false;
}

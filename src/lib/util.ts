export function serializeQuery(value: string | string[]) {
  if (Array.isArray(value)) return decodeURIComponent(value[value.length - 1]);
  return decodeURIComponent(value);
}

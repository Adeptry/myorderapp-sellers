export function mapNumberEnum<T extends Record<string | number, unknown>, U>(
  enumerable: T,
  fn: (v: number) => U
): U[] {
  return Object.values(enumerable)
    .filter(Number.isInteger)
    .map((value) => fn(value as unknown as number)); // we are sure the value is a number because of the filter
}

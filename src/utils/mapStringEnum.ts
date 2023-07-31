export function mapStringEnum<T extends Record<string | number, unknown>, U>(
  enumerable: T,
  fn: (v: string) => U
): U[] {
  return Object.values(enumerable).map((value) =>
    fn(value as unknown as string)
  );
}

export const isError = (x: unknown): x is Error => {
  return x instanceof Error;
};

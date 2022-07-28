export {};

declare global {
  interface ObjectConstructor {
    entries<T, K extends string = string>(o: { [key in K]?: T }): [K, T][];
  }
}
export {};

declare global {
  interface ObjectConstructor {
    entries<T, K extends string = string>(o: { [key in K]?: T }): [K, T][];
  }

  namespace Reflect {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function getOwnMetadata<Return>(metadataKey: any, target: object): Return;
  }
}

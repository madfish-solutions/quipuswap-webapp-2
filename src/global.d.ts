export {};

declare global {
  interface ObjectConstructor {
    entries<T, K extends string = string>(o: { [key in K]?: T }): [K, T][];
  }

  namespace Reflect {
    function getOwnMetadata<Return>(metadataKey: PropertyKey, target: object): Return;
    function getMetadata<Return>(metadataKey: PropertyKey, target: object): Return;
  }
}

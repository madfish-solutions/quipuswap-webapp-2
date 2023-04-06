export {};

// take from https://github.com/total-typescript/ts-reset/blob/main/src/entrypoints/utils.d.ts
type NonFalsy<T> = T extends false | 0 | '' | null | undefined | 0n ? never : T;

declare global {
  interface ObjectConstructor {
    entries<T, K extends string = string>(o: { [key in K]?: T }): [K, T][];
  }

  namespace Reflect {
    function getOwnMetadata<Return>(metadataKey: PropertyKey, target: object): Return;
    function getMetadata<Return>(metadataKey: PropertyKey, target: object): Return;
  }

  interface Array<T> {
    filter<This>(predicate: BooleanConstructor, thisArg?: This): NonFalsy<T>[];
  }
}

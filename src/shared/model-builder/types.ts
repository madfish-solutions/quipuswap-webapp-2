import { Constructable } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface LedDecoratorMetadata<RawData = any, Data = any, Store = any> {
  default: Data;
  loader: (self: Store) => Promise<RawData>;
  model: Constructable;
}

export interface LedMetadataValue extends LedDecoratorMetadata {
  propertyKey: PropertyKey;
}

import { Constructable } from '../types';

export interface LedDecoratorMetadataProposal<
  ModelType extends object = object,
  Data extends Nullable<object> = object,
  LoaderArgs extends unknown[] = unknown[],
  RawData extends object = object
> {
  default: Data;
  loader: (...args: LoaderArgs) => Promise<RawData>;
  model: Constructable<ModelType>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface LedDecoratorMetadata<RawData = any, Data = any, Store = any> {
  default: Data;
  loader: (self: Store) => Promise<RawData>;
  model: Constructable;
}

export interface LedMetadataValue extends LedDecoratorMetadata {
  propertyKey: PropertyKey;
}

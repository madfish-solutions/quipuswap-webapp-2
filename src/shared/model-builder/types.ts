import { Constructable } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface LedDecoratorMetadata<RawData = any, Data = any> {
  defaultData: Data;
  getData: () => Promise<RawData>;
  dto: Constructable;
  model: Constructable;
}

export interface LedMetadataValue extends LedDecoratorMetadata {
  propertyKey: PropertyKey;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface LedDecoratorMetadata<RawData = any, Data = any> {
  defaultData: Data;
  getData: () => Promise<RawData>;
  dto: any;
  model: any;
}

export interface LedMetadataValue extends LedDecoratorMetadata {
  propertyKey: PropertyKey;
}

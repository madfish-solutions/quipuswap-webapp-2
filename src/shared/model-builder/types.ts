/* eslint-disable @typescript-eslint/no-explicit-any */

export interface LedDecoratorMetadata<RawData = any, Data = any> {
  defaultData: Data;
  getData: () => Promise<RawData>;
  dto: any;
}

export interface LedMetadataValue extends LedDecoratorMetadata {
  propertyKey: PropertyKey;
}

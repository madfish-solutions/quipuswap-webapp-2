/* eslint-disable @typescript-eslint/no-explicit-any */
import { LED_METADATA_KEY } from './led-metadata-key';
import { LedDecoratorMetadata, LedMetadataValue } from './types';

export function Led({ defaultData, getData, dto, model }: LedDecoratorMetadata): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const pervValues = Reflect.getOwnMetadata<Array<LedMetadataValue>>(LED_METADATA_KEY, target) ?? [];
    Reflect.defineMetadata(
      LED_METADATA_KEY,
      [...pervValues, { propertyKey, defaultData, getData, dto, model }],
      target
    );
  };
}

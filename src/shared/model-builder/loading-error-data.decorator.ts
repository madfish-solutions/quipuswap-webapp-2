import { LED_METADATA_KEY } from './led-metadata-key';
import { LedDecoratorMetadata, LedMetadataValue } from './types';

export function Led({ default: defaultData, loader, model }: LedDecoratorMetadata): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol): void {
    const pervValues = Reflect.getOwnMetadata<Array<LedMetadataValue>>(LED_METADATA_KEY, target) ?? [];
    Reflect.defineMetadata(
      LED_METADATA_KEY,
      [...pervValues, { propertyKey, default: defaultData, loader, model }],
      target
    );
  };
}

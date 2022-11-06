import { LoadingErrorDataProposal } from '@shared/store';

import { LED_METADATA_KEY } from './led-metadata-key';
import { LedDecoratorMetadata, LedDecoratorMetadataProposal, LedMetadataValue } from './types';

//#endregion proposal

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

//#region proposal
type Target<
  K extends string,
  ModelType extends object = object,
  Data extends Nullable<object> = object,
  LoaderArgs extends unknown[] = unknown[],
  RawData extends object = object
> = {
  [A in K]: LoadingErrorDataProposal<ModelType, Data, LoaderArgs, RawData>;
};

export function LedProposal<
  ModelType extends object = object,
  Data extends Nullable<object> = object,
  LoaderArgs extends unknown[] = unknown[],
  RawData extends object = object
>({ default: defaultData, loader, model }: LedDecoratorMetadataProposal<ModelType, Data, LoaderArgs, RawData>) {
  // eslint-disable-next-line sonarjs/no-identical-functions
  return function <K extends string, C extends Target<K, ModelType, Data, LoaderArgs, RawData>>(
    target: C,
    propertyKey: K
  ): void {
    const pervValues = Reflect.getOwnMetadata<Array<LedMetadataValue>>(LED_METADATA_KEY, target) ?? [];
    Reflect.defineMetadata(
      LED_METADATA_KEY,
      [...pervValues, { propertyKey, default: defaultData, loader, model }],
      target
    );
  };
}

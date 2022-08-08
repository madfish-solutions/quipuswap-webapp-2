/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMetadataVales, TYPED_MARK_SYMBOL } from '@shared/decorators';

import { getMapperKind } from './get-mapper-kind';

export const createConfigMap = (prototype: any) => {
  const mapperConfig: Record<any, any> = {};
  const dtoFields = Reflect.getMetadata<Array<IMetadataVales>>(TYPED_MARK_SYMBOL, prototype);

  for (const dtoField of dtoFields) {
    const type = dtoField.isEnum
      ? String
      : dtoField.type ?? Reflect.getMetadata('design:type', prototype, dtoField.propertyKey);

    const dtoFieldMetadata = Reflect.getMetadata<Array<IMetadataVales>>(TYPED_MARK_SYMBOL, type.prototype);

    mapperConfig[dtoField.propertyKey] = {
      isArray: dtoField.isArray,
      optional: dtoField.optional,
      nullable: dtoField.nullable
    };

    if (dtoFieldMetadata) {
      mapperConfig[dtoField.propertyKey].shape = createConfigMap(type.prototype);
    } else {
      mapperConfig[dtoField.propertyKey].mapper = getMapperKind(type);
    }
  }

  return mapperConfig;
};

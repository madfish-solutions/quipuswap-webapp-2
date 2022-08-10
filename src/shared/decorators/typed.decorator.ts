import { Constructable } from '../types';
import { TYPED_MARK_SYMBOL } from './typed-mark-symbol';

interface ITyped {
  isArray?: boolean;
  type?: Constructable;
  optional?: boolean;
  nullable?: boolean;
  isEnum?: boolean;
}

export interface IMetadataVales extends ITyped {
  propertyKey: string;
}

export const Typed = ({ type, optional = false, nullable = false, isArray = false, isEnum = false }: ITyped = {}) => {
  return (prototype: object, propertyKey: string) => {
    const existsMetadataValues = Reflect.getMetadata(TYPED_MARK_SYMBOL, prototype) ?? [];
    Reflect.defineMetadata(
      TYPED_MARK_SYMBOL,
      [...existsMetadataValues, { propertyKey, type, isArray, optional, nullable, isEnum }],
      prototype
    );
  };
};

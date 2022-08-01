/* eslint-disable @typescript-eslint/no-explicit-any */
import { TYPED_MARK_SYMBOL } from './typed-mark-symbol';

interface ITyped {
  isArray?: boolean;
  type?: any;
}

export interface IMetadataVales extends ITyped {
  propertyKey: string;
}

export const Typed = ({ type, isArray = false }: ITyped = {}) => {
  return (prototype: object, propertyKey: string) => {
    const existsMetadataValues = Reflect.getMetadata(TYPED_MARK_SYMBOL, prototype) ?? [];
    Reflect.defineMetadata(TYPED_MARK_SYMBOL, [...existsMetadataValues, { propertyKey, type, isArray }], prototype);
  };
};

import { TYPED_MARK_SYMBOL } from './typed-mark-symbol';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ITyped {
  isArray?: boolean;
  type?: any;
}

export const Typed = ({ isArray = false, type }: ITyped = {}) => {
  return (prototype: object, propertyKey: string) => {
    const existsMetadataValues = Reflect.getMetadata(TYPED_MARK_SYMBOL, prototype) ?? [];
    Reflect.defineMetadata(TYPED_MARK_SYMBOL, [...existsMetadataValues, { propertyKey, isArray, type }], prototype);
  };
};

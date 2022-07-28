import { TYPED_MARK_SYMBOL } from './typed-mark-symbol';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ITyped {
  isArray?: boolean;
  typeField?: any;
}

export const Typed = ({ isArray, typeField }: ITyped = {}) => {
  return (prototype: object, propertyKey: string) => {
    const existsMetadataValues = Reflect.getMetadata(TYPED_MARK_SYMBOL, prototype) ?? [];
    Reflect.defineMetadata(
      TYPED_MARK_SYMBOL,
      [...existsMetadataValues, { propertyKey, isArray, typeField }],
      prototype
    );
  };
};

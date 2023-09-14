import { Option } from '@shared/types';

export const unpackOption = <T>(option: Option<T>): T | null => {
  return option?.Some ?? null;
};

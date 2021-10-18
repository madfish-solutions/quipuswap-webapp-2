import { TEZOS_TOKEN } from '@utils/defaults';
import { parseDecimals } from './parseDecimals';

export const parseTezDecimals = (value: string) => parseDecimals(
  value,
  0,
  Infinity,
  TEZOS_TOKEN.metadata.decimals,
);

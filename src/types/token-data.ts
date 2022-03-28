import { Standard } from "./standard";
import { Nullable } from "./type-check";

export interface TokenDataType {
  token: {
    address: string;
    type: Standard;
    id?: number | null;
    decimals: number;
  };
  balance: Nullable<string>;
  exchangeRate?: string;
}

export interface TokenDataMap {
  first: TokenDataType;
  second: TokenDataType;
}

export interface TokenMetadata {
  decimals: number;
  symbol: string;
  name: string;
  thumbnailUri: string;
}

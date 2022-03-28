import { Token } from "./token-type";

export interface PoolTableType {
  id: number;
  xtzUsdQuote: string;
  token1: Token;
  token2: Token;
  pair: {
    name: string;
    token1: {
      icon: string;
      symbol: string;
      id: string;
      tokenId: string;
    };
    token2: {
      icon: string;
      symbol: string;
      id: string;
      tokenId: string;
    };
  };
  data: {
    tvl: number;
    volume24h: number;
  };
  buttons: {
    first: {
      label: string;
      href: string;
      external: boolean;
    };
    second: {
      label: string;
      href: string;
    };
  };
}

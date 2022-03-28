import BigNumber from "bignumber.js";

export interface WhitelistedBakerEmpty {
  address: string;
}

export interface WhitelistedBakerFull extends WhitelistedBakerEmpty {
  name: string;
  logo: string;
  votes: number;
  fee: number;
  freeSpace: BigNumber;
}

export type WhitelistedBaker = WhitelistedBakerEmpty | WhitelistedBakerFull;

export const isFullBaker = (baker: WhitelistedBaker): baker is WhitelistedBakerFull => baker && 'name' in baker;

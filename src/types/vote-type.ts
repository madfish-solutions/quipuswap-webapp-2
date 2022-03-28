import { BigNumber } from "bignumber.js";
import { Nullable } from "./type-check";

export interface VoterType {
  vote: Nullable<BigNumber>;
  veto: Nullable<BigNumber>;
  candidate: Nullable<string>;
}

export interface VoteFormValues {
  balance1: number;
  selectedBaker: string;
  currentBacker?: string;
}

import { Nullable } from "./type-check";

export enum SortType {
  LeftLeft = 'Left-Left',
  RightRight = 'Right-Right',
  LeftRight = 'Left-Right'
}

export interface SortTokensContractsType {
  addressA: string;
  addressB: string;
  idA: Nullable<number>;
  idB: Nullable<number>;
  isRevert?: boolean;
  type: SortType;
}

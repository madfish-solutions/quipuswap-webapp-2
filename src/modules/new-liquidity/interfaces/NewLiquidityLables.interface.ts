export enum Icon {
  CASE = 'CASE',
  MEDAL = 'MEDAL',
  DOLLAR = 'DOLLAR'
}

export interface NewLiquidityLablesInterface {
  [Icon.CASE]?: boolean;
  [Icon.MEDAL]?: boolean;
  [Icon.DOLLAR]?: boolean;
}

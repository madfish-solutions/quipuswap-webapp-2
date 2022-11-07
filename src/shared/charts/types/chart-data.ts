export interface PieChart {
  value: number;
  tokenValue: number;
  tokenSymbol: string;
}

export interface PieChartData {
  data: Array<PieChart>;
}

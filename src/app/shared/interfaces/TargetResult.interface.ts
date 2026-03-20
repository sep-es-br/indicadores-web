export interface ITargetResult {
  value: number;
  showValue: string;
  year: number;
  justificationGoal?: string;
}

export interface IFilteredResult {
  value: number;
  showValue: string;
  year?: number;
  justificationGoal?: string;
}

export interface IYearTargetResult {
  year?: number;
  times?: Omit<ITimes, 'year'>[];
}

export interface ITimes {
  type: string;
  year: string;
  period: number;
  valueGoal: number;
  showValueGoal: string;
  valueResult: number;
  showValueResult: string;
  justificationGoal: string;
  justificationResult: string;
}

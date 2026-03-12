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
  targetFor: IFilteredResult[];
  resultedIn: IFilteredResult[];
}

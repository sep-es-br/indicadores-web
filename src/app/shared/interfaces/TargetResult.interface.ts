export interface ITargetResult {
    value: number
    showValue: string
    year: number
}

export interface IFilteredResult {
    value: number;
    showValue: string;
}

export interface IYearTargetResult {
    year: number
    targetFor: IFilteredResult[]
    resultedIn: IFilteredResult[]
}
import { ITargetResult } from "./TargetResult.interface"

export interface Iindicator{
    id: string
    measureUnit: string
    name: string
    organizationAcronym: string
    polarity: string
    justificationBase?: string
    justificationGoal?: string
    fileName?: string
    originalFileName?: string
    ods: number[]
    targetFor: ITargetResult[]
    resulted: ITargetResult[]
}
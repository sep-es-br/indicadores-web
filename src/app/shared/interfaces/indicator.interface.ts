import { ITargetResult } from "./TargetResult.interface"

export interface Iindicator{
    id: string
    measureUnit: string
    name: string
    organizationAcronym: string
    polarity: string
    ods: number[]
    targetFor: ITargetResult[]
    resulted: ITargetResult[]
}
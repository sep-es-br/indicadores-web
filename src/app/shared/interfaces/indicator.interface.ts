import { ITargetResult } from "./TargetResult.interface"

export interface Iindicator{
    uuId: string
    measureUnit: string
    name: string
    organizationAcronym: string
    polarity: string
    ods: number[]
    targetFor: ITargetResult[]
    resultedIn: ITargetResult[]
}
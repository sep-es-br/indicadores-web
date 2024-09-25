import { IChallenge } from "./challenge.interface";

export interface IArea {
	startOfAdministrationYear: number,
	endOfAdministrationYear: number,
	id: string,
	name: string,
	icon: string,
    description: string,
	indicator: number,
	challenge: IChallenge[]
}

export interface IAreaData{
	id: string,
	name: string,
}

export interface IAreaOverview {
	id: string,
	name: string,
	icon: string,
    description: string,
	indicator: number,
	challenge: number
}
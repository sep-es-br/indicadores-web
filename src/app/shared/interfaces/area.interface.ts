import { IChallenge } from "./challenge.interface";

export interface IArea {
	id: number,
	name: string,
	icon: string,
    description: string,
	indicator: number,
	challenge: IChallenge[]
}

export class AreaData{
	id = 0;
	name = "Segurança em defesa da vida";
	icon = "fa-shield-halved";
	indicator = 0;
	challenge = 0;
}

export interface IAreaData{
	id: number,
	name: string,
}

export interface IAreaOverview {
	id: number,
	name: string,
	icon: string,
    description: string,
	indicator: number,
	challenge: number
}
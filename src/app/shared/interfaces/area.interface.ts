export interface IArea {
	id: number,
	name: string,
	icon: string,
    description: string,
	indicator: number,
	challenge: number
}

export class AreaData{
	id = 0;
	name = "Segurança em defesa da vida";
	icon = "fa-shield-halved";
	indicator = 0;
	challenge = 0;
}

export interface IAreaOverview {
	id: number,
	name: string,
	icon: string,
    description: string,
	indicator: number,
	challenge: number
}
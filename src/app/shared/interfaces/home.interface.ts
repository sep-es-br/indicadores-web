import {  IAreaOverview } from "./area.interface";

export interface IHome {
	name: string;
	status: boolean;
	startYear: number;
	endYear: number;
	referenceYear: number;
	description: string;
	overview: {
		areasEstrategicas: number;
		desafios: number;
		indicadores: number;
	}
	areas?:IAreaOverview[]
}

export class HomeData{
	name: string = "";
	status: boolean = false;
	startYear: number = 0;
	endYear: number = 0;
	referenceYear: number = 0;
	description: string = "";
	overview = new OverviewData();
}

export class OverviewData{
	areasEstrategicas: number = 0;
	desafios: number = 0;
	indicadores: number = 0;
}
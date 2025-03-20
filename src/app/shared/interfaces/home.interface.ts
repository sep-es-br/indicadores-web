import {  IAreaOverview } from "./area.interface";

export interface IHome {
	name: string;
	status: boolean;
	startYear: number;
	endYear: number;
	referenceYear: number;
	description: string;
	overview: {
		organizer: OverViewOrganizer;
		desafios: number;
		indicadores: number;
	}
	organizers?:{ [key: string]: IAreaOverview[] };
}

export interface OrganizerItem {
	name: string;
	nameInPlural: string;
	countOrganizer: number;
	relationshipType: string;
  }

export interface OverViewOrganizer {
	parentOrganizer: OrganizerItem[];
	childOrganizer: OrganizerItem[];
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
	organizer: OverViewOrganizer = { parentOrganizer: [], childOrganizer: [] };
	desafios: number = 0;
	indicadores: number = 0;
}
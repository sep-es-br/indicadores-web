import { IChallenge } from './challenge.interface';

export interface IArea {
  startOfAdministrationYear: number;
  endOfAdministrationYear: number;
  administrationName: string;
  id: string;
  name: string;
  description: string;
  modelName: string;
  modelNameInPlural: string;
  icon: string;
  indicator: number;
  challenge: IChallenge[];
}

export interface IAreaData {
  id: string;
  name: string;
}

export interface IAreaOverview {
  id: string;
  name: string;
  icon: string;
  description: string;
  indicator: number;
  challenge: number;
}

import { Iindicator } from "./indicator.interface";

export interface IChallenge {
	uuId: string,
	name: string,
	indicatorList: Iindicator
}
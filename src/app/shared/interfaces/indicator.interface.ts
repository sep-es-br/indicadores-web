import { ITargetResult, ITimes } from './TargetResult.interface';

export interface Iindicator {
  id: string;
  uuId: string;
  name: string;
  measureUnit: string;
  organizationAcronym: string;
  polarity: string;
  justificationBase?: string;
  fileName?: string;
  originalFileName?: string;
  ods: number[];
  times: ITimes[];
}

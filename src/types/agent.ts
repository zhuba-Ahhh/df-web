export interface AgentType {
  id: number;
  operatorID: number;
  operator: string;
  fullName: string;
  armyType: string;
  pic: string;
  sort: number;
  prePic: string;
  armyTypePic: string;
  armyTypeDesc: string;
  abilitiesList: AbilitiesList[];
  strategyList: StrategyList[];
}

export interface AbilitiesList {
  abilityType: AbilityType;
  abilityTypeCN: AbilityTypeCN;
  position: string;
  positionCN: string;
  abilityName: string;
  abilityDesc: string;
  abilityPic: string;
  sort: number;
}

export enum AbilityType {
  Forte = 'forte',
  Gear = 'gear',
  Props = 'props',
}

export enum AbilityTypeCN {
  干员特长 = '干员特长',
  战术装备 = '战术装备',
  战术道具 = '战术道具',
}

export interface StrategyList {
  tagID: string;
  tagType: TagType;
}

export enum TagType {
  God = 'god',
  OneMinute = 'oneMinute',
}

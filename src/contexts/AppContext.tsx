import { createContext } from 'react';
import { CookieItem, TeammateArr } from 'types/info';
import { CollectionItemDetails } from 'views/WeekReportView';

type collectsItem = {
  title: string;
  info: Info[];
  get_num: number;
  sum: number;
};

export interface Info {
  id: number;
  img: string;
  name: string;
  lock: boolean;
  class: string;
  source: Source[];
  purpose: Purpose[];
  pid: string;
}

enum Purpose {
  兑换扩容箱 = '兑换扩容箱',
  兑换生产材料 = '兑换生产材料',
  升级特勤处 = '升级特勤处',
}

enum Source {
  交易行 = '交易行',
  巴克什 = '巴克什',
  航天基地 = '航天基地',
  长弓溪谷 = '长弓溪谷',
  零号大坝 = '零号大坝',
}

export interface CollectMap {
  itemidArray: { [key: string]: ItemidArray };
  typeArray: { [key: string]: TypeArray };
  progressArray: { [key: string]: number };
}

export interface ItemidArray {
  id: number;
  img: string;
  name: string;
  lock: boolean;
  class: Class;
  source: Source[];
  purpose: Purpose[];
}

enum Class {
  DjSize1 = 'dj_size_1',
  DjSize12 = 'dj_size_12',
  DjSize2 = 'dj_size_2',
  DjSize3_4 = 'dj_size_3_4',
  DjSize4 = 'dj_size_4',
  DjSize4_L = 'dj_size_4_l',
  DjSize6 = 'dj_size_6',
  DjSize6_H = 'dj_size_6_h',
  DjSize9 = 'dj_size_9',
}

export interface TypeArray {
  title: string;
  info: ItemidArray[];
  get_num: number;
  sum: number;
}

export interface AppContextType {
  mapName: Record<string, string>;
  agentImg: Record<number, string>;
  agentName: Record<number, string>;
  isMenuCollapsed?: boolean;
  rank: Record<number, string>;
  seasonOptions: string[];
  ck: string;
  seasonid: string;
  teammateArr?: TeammateArr[];
  toggleMenu?: () => void;
  updateConfig?: (partialConfig: Partial<AppContextType>) => void;
  collects: collectsItem[];
  collectMap: CollectMap;
  ckOptions: CookieItem[];
  allCollectsMap: Record<string, CollectionItemDetails>;
}

export const AppContext = createContext<AppContextType | null>(null);

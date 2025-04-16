import { createContext } from 'react';
import { TeammateArr } from 'types/info';

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
}

export const AppContext = createContext<AppContextType | null>(null);

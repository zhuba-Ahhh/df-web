import { List as ItemList } from '../services/props';
// 对局信息
export interface Datum {
  ArmedForceId: number;
  CarryoutSafeBoxPrice: number;
  CarryoutSelfPrice: number;
  dtEventTime: string;
  DurationS: number;
  EscapeFailReason: number;
  FinalPrice: string;
  flowCalGainedPrice: number;
  KeyChainCarryInPrice: number;
  KeyChainCarryOutPrice: string;
  KillAICount: number;
  KillCount: number;
  KillPlayerAICount: number;
  MapId: string;
  teammateArr: TeammateArr[];
}

export interface TeammateArr {
  ArmedForceId: number;
  CarryoutSafeBoxPrice: number;
  CarryoutSelfPrice: number;
  dtEventTime: string;
  DurationS: number;
  EscapeFailReason: number;
  FinalPrice: string;
  KeyChainCarryInPrice: number;
  KeyChainCarryOutPrice: string;
  KillAICount: number;
  KillCount: number;
  KillPlayerAICount: number;
  MapId: string;
  nickName: string;
  Rescue: number; // 救助/复活
  TeamId: string;
  vopenid: boolean;
}

// 生涯信息
export interface JData {
  careerData: CareerData;
  userData: UserData;
}

export interface CareerData {
  avgkillperminute: string;
  error_info: number;
  rankpoint: string;
  result: number;
  solduration: string;
  solescaperatio: string;
  soltotalfght: string;
  soltotalkill: string;
  solttotalescape: string;
  tdmduration: string;
  tdmrankpoint: string;
  tdmsuccessratio: string;
  tdmtotalfight: string;
  tdmtotalkill: number;
  totalwin: string;
}

export interface UserData {
  charac_name: string; // 用户名
  picurl: string; // 用户头像
}

export interface AssetsResponse {
  code: number;
  data: [string, string, string]; // [三角币, 三角券, 哈夫币]
}

export interface ThreadDetailResponse {
  title: string;
  content: {
    text: string;
  };
  createdAt: string;
  editedAt: string;
}

export interface AssetData {
  label: string;
  records: {
    timestamp: string;
    data: string[];
  }[];
}

export interface CollectsRes {
  iRet: string;
  sMsg: string;
  itemidList: { [key: string]: string };
  typeArr: { [key: string]: number };
  count: string;
  nickName: string;
  headImg: string;
  milestoneHolds: string;
  sCollectionHolds: string;
  loginDayHolds: string;
  isGiftDay: boolean;
  isShowRankNum: boolean;
  rankNum: string;
}

export interface CookieItem {
  label: string;
  value: string;
}

export interface IYesterdayProfit {
  currentTime: string;
  solDetail: SolDetail;
}

export interface SolDetail {
  recentGain: number;
  recentGainDate: string;
  userCollectionTop: UserCollectionTop;
}

export interface UserCollectionTop {
  date: string;
  list: List[];
}

export interface List {
  count: string;
  objectID: string;
  price: string;
}

export type DailySecretResponse = Array<{
  mapName: string;
  key: number;
}>;

export type IPersonResource = {
  redTotalMoney: number;
  redTotalCount: number;
  mapList: MapList[];
  redCollectionDetail: RedCollectionDetail[];
  levelScore: string;
  majorLevel: string;
  majorLevelMax: string;
  profitLossRatio: string;
  highKillDeathRatio: string;
  lowKillDeathRatio: string;
  medKillDeathRatio: string;
  totalEscape: string;
  totalFight: string;
  totalGainedPrice: string;
  totalGameTime: string;
  totalKill: string;
  userRank: number;
  gunPlayList: GunPlayList[];
} | null;

interface GunPlayList {
  objectID: number;
  escapeCount: number;
  fightCount: number;
  totalPrice: number;
}

interface RedCollectionDetail {
  objectID: number;
  count: number;
  price: number;
}

interface MapList {
  mapID: number;
  totalCount: number;
  leaveCount: number;
}

export type IManufacturingDetails = {
  appletRecord: string[];
  nowTime: number;
  placeData: PlaceDatum[];
  relateMap: Record<string, ItemList>;
} | null;

export interface PlaceDatum {
  Id: string;
  leftTime: number;
  Level: string;
  Name: string;
  objectId: number;
  placeName: string;
  placeType: string;
  pushTime: number;
  Status: string;
}

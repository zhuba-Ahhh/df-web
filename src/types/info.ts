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

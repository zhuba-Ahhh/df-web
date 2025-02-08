import { Context } from 'App';
import { useEffect, useState, useCallback, useContext } from 'react';
import { http, formatDuration } from 'utils';

export interface Datum {
  ArmedForceId: number; // 干员id
  CarryoutSafeBoxPrice: number;
  CarryoutSelfPrice: number;
  dtEventTime: string; // 开始时间
  DurationS: number; // 持续时间
  EscapeFailReason: number; // 是否撤离成功 1是 0否
  FinalPrice: string; // 最终赚取金额
  flowCalGainedPrice: number; // 净赚额
  KeyChainCarryInPrice: number;
  KeyChainCarryOutPrice: string;
  KillAICount: number; // 击杀ai人数
  KillCount: number; // 击杀人数
  KillPlayerAICount: number; // 击杀玩家人数
  MapId: string; // 地图id
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
  Rescue: number;
  TeamId: string;
  vopenid: boolean;
}

const fetchInfo = async (page?: string) => {
  try {
    const response = await http.get<Datum[]>(`/info/getInfo?page=${page || 1}`);

    return response;
  } catch (error) {
    console.error(error);

    return [];
  }
};

const InfoView = () => {
  const [data, setData] = useState<Datum[]>([]);
  const context = useContext(Context);

  const fetchAccessories = useCallback(async () => {
    const res = await fetchInfo();
    setData(res);
  }, []);

  useEffect(() => {
    fetchAccessories();
  }, [fetchAccessories]);

  const getStatusColor = (escapeFailReason: number) => {
    return escapeFailReason === 1 ? 'text-green-500' : 'text-red-500';
  };

  const getStatusText = (escapeFailReason: number) => {
    return escapeFailReason === 1 ? '撤离成功' : '撤离失败';
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getMapName = (mapId: string) => {
    return context?.mapName?.[mapId] || '未知地图';
  };

  const formatNumber = (num: string | number) => {
    return Number(num).toLocaleString('zh-CN');
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-900 text-white">
      {data?.map((item, index) => (
        <div key={index} className="flex items-center justify-between bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden">
              <img
                src={context?.agentImg?.[item.ArmedForceId]}
                className="h-full object-cover"
                alt=""
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className={`text-lg font-bold ${getStatusColor(item.EscapeFailReason)}`}>
                  {getStatusText(item.EscapeFailReason)}
                </span>
                <span className="text-gray-400">{context?.agentName[item.ArmedForceId]}</span>
              </div>
              <div className="text-sm text-gray-400">烽火地带 | {getMapName(item.MapId)}</div>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="text-gray-400">
              开始时间：{formatDateTime(item.dtEventTime)} 游戏时长：
              {formatDuration(item.DurationS)}
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <span className="text-gray-400 mr-1">击杀玩家:</span>
                <span>{item.KillCount}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 mr-1">收益:</span>
                <span>{formatNumber(item.FinalPrice)}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-400 mr-1">净收益:</span>
                <span>{formatNumber(item.flowCalGainedPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { InfoView };

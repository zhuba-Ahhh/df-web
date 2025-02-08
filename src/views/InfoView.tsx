import { Context } from 'App';
import { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { http, formatDuration } from 'utils';
import { useInView } from 'react-intersection-observer';
import { PullStatus, PullToRefreshify } from 'react-pull-to-refreshify';

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

const renderText = (pullStatus: PullStatus, percent: number) => {
  switch (pullStatus) {
    case 'pulling':
      return (
        <div>
          {`下拉即可刷新 `}
          <span style={{ color: 'green' }}>{`${percent.toFixed(0)}%`}</span>
        </div>
      );

    case 'canRelease':
      return '释放即可刷新...';

    case 'refreshing':
      return '刷新中';

    case 'complete':
      return '刷新成功';

    default:
      return '';
  }
};

const InfoView = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<Datum[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const context = useContext(Context);
  const { ref, inView } = useInView();
  const [refreshing, setRefreshing] = useState(false);

  const fetchAccessories = useCallback(async (currentPage: number) => {
    setLoading(currentPage === 1);
    try {
      const res = await fetchInfo(currentPage.toString());
      setData((prev) => [...prev, ...res]);
      if (!res || res.length < 50) {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccessories(1);
  }, [fetchAccessories]);

  // 监听页码变化，加载新数据
  useEffect(() => {
    if (page > 1) {
      fetchAccessories(page);
    }
  }, [page, fetchAccessories]);

  useEffect(() => {
    if (inView) {
      setPage((prev) => prev + 1);
    }
  }, [inView]);

  const getStatusColor = (escapeFailReason: number) => {
    return escapeFailReason === 1 ? 'text-green-500' : 'text-red-500';
  };

  const getStatusColor1 = (flowCalGainedPrice: number) => {
    return flowCalGainedPrice > 0 ? 'text-green-500' : 'text-red-500';
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400">加载中...</span>
        </div>
      </div>
    );
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    const res = await fetchInfo('1');
    setData(res);
    if (!res || res.length < 50) {
      setHasMore(false);
    }
    setRefreshing(false);
  };

  return (
    <PullToRefreshify refreshing={refreshing} onRefresh={handleRefresh} renderText={renderText}>
      <div
        ref={containerRef}
        className="flex flex-col space-y-4 md:space-y-6 p-4 md:p-6 bg-gray-900 text-white min-h-screen overflow-y-auto"
      >
        {data?.map((item, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row md:items-center justify-between bg-gray-800/80 backdrop-blur p-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg hover:bg-gray-800/90 transition-all duration-300 border border-gray-700 space-y-4 md:space-y-0"
          >
            <div className="flex items-center space-x-3 md:space-x-8">
              <div className="w-14 h-14 md:w-24 md:h-24 bg-gray-700 rounded-lg md:rounded-xl overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300">
                <img
                  src={context?.agentImg?.[item.ArmedForceId]}
                  className="h-full w-full object-cover"
                  alt=""
                />
              </div>
              <div className="flex flex-col space-y-1.5 md:space-y-3">
                <div className="text-xs md:text-base text-gray-400 flex items-center space-x-2 md:space-x-3 font-medium">
                  <span
                    className={`${getStatusColor(
                      item.EscapeFailReason
                    )} bg-opacity-20 tracking-wider`}
                  >
                    {getStatusText(item.EscapeFailReason)}
                  </span>
                  &nbsp;&nbsp;&nbsp;
                  <span className="text-gray-100 font-semibold tracking-wide">
                    {context?.agentName[item.ArmedForceId]}
                  </span>
                </div>
                <div className="text-xs md:text-base text-gray-400 flex items-center space-x-2 md:space-x-3 font-medium">
                  <span>烽火地带</span>
                  <span className="text-gray-600">|</span>
                  <span className="text-gray-300">{getMapName(item.MapId)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2 w-full md:w-auto">
              <div className="text-gray-300 text-xs md:text-base space-y-0.5 md:space-y-1 md:text-right">
                <div className="flex items-center justify-between md:justify-end md:space-x-2">
                  <span className="text-gray-400">开始时间：</span>
                  <span>{formatDateTime(item.dtEventTime)}</span>
                </div>
                <div className="flex items-center justify-between md:justify-end md:space-x-2">
                  <span className="text-gray-400">游戏时长：</span>
                  <span>{formatDuration(item.DurationS)}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 md:gap-4 md:flex md:items-center md:space-x-8">
                <div className="flex flex-col items-center md:items-end">
                  <span className="text-gray-400 text-[10px] md:text-sm mb-0.5 md:mb-1">
                    击杀玩家
                  </span>
                  <span className="text-base md:text-xl font-bold tracking-wider">
                    {item.KillCount}
                  </span>
                </div>
                <div className="flex flex-col items-center md:items-end">
                  <span className="text-gray-400 text-[10px] md:text-sm mb-0.5 md:mb-1">收益</span>
                  <span className="text-base md:text-xl font-bold text-yellow-500 tracking-wider">
                    {formatNumber(item.FinalPrice)}
                  </span>
                </div>
                <div className="flex flex-col items-center md:items-end">
                  <span className="text-gray-400 text-[10px] md:text-sm mb-0.5 md:mb-1">
                    净收益
                  </span>
                  <span
                    className={`text-base md:text-xl font-bold ${getStatusColor1(
                      item.flowCalGainedPrice
                    )} tracking-wider`}
                  >
                    {formatNumber(item.flowCalGainedPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {inView && hasMore && (
          <div className="flex justify-center pt-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div ref={ref} style={{ height: '1px' }} />

        {!hasMore && data.length > 0 && (
          <div className="text-center text-gray-500 pb-4">没有更多数据了</div>
        )}
      </div>
    </PullToRefreshify>
  );
};

export { InfoView };

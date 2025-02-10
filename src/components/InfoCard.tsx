import { Context } from 'App';
import { useContext } from 'react';
import { formatDateTime, formatNumber } from '../utils/format';
import { formatDuration } from 'utils';
import type { Datum } from '../types/info';

interface InfoCardProps {
  item: Datum;
}

const getStatusColor = (escapeFailReason: number) => {
  return escapeFailReason === 1 ? 'text-green-500' : 'text-red-500';
};

const getStatusColor1 = (flowCalGainedPrice: number) => {
  return flowCalGainedPrice > 0 ? 'text-green-500' : 'text-red-500';
};

const getStatusText = (escapeFailReason: number) => {
  return escapeFailReason === 1 ? '撤离成功' : '撤离失败';
};

export const InfoCard = ({ item }: InfoCardProps) => {
  const context = useContext(Context);

  const getMapName = (mapId: string) => {
    return context?.mapName?.[mapId] || '未知地图';
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between bg-gray-800/80 backdrop-blur p-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg hover:bg-gray-800/90 transition-all duration-300 border border-gray-700 space-y-4 md:space-y-0">
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
              className={`${getStatusColor(item.EscapeFailReason)} bg-opacity-20 tracking-wider`}
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
            <span className="text-gray-400 text-[10px] md:text-sm mb-0.5 md:mb-1">击杀玩家</span>
            <span className="text-base md:text-xl font-bold tracking-wider">{item.KillCount}</span>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-gray-400 text-[10px] md:text-sm mb-0.5 md:mb-1">收益</span>
            <span className="text-base md:text-xl font-bold text-yellow-500 tracking-wider">
              {formatNumber(item.FinalPrice)}
            </span>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-gray-400 text-[10px] md:text-sm mb-0.5 md:mb-1">净收益</span>
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
  );
};

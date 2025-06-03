import { useAppContext } from 'contexts/AppProvider';
import {
  formatDateTime,
  formatNumber,
  getStatusColor,
  getStatusColor1,
  getStatusText,
} from '../utils/format';
import { formatDuration } from 'utils';
import type { Datum } from '../types/info';

interface InfoCardProps {
  item: Datum;
}

export const InfoCard = ({ item }: InfoCardProps) => {
  const context = useAppContext();

  const getMapName = (mapId: string) => {
    return context?.mapName?.[mapId] || '未知地图';
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between bg-gray-800/80 backdrop-blur p-3 md:p-4 rounded-xl md:rounded-2xl shadow-lg hover:bg-gray-800/90 transition-all duration-300 border border-gray-700 space-y-1 md:space-y-0">
      <div className="flex items-center space-x-2 md:space-x-4 flex-grow">
        <div className="w-12 h-12 md:w-20 md:h-20 bg-gray-700 rounded-lg md:rounded-xl overflow-hidden shadow-md transform hover:scale-105 transition-transform duration-300 flex-shrink-0">
          <img
            src={context?.agentImg?.[item.ArmedForceId]}
            className="h-full w-full object-cover"
            alt=""
          />
        </div>
        <div className="flex flex-col space-y-1 md:space-y-1.5">
          <div className="text-[10px] md:text-sm text-gray-400 flex flex-wrap items-center space-x-1 md:space-x-2 font-medium">
            <span
              className={`${getStatusColor(item.EscapeFailReason)} bg-opacity-20 tracking-wider px-1 rounded-sm`}
            >
              {getStatusText(item.EscapeFailReason)}
            </span>
            <span className="text-gray-100 font-semibold tracking-wide">
              {context?.agentName[item.ArmedForceId]}
            </span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-300">{getMapName(item.MapId)}</span>
          </div>
          <div className="text-[10px] md:text-sm text-gray-400 flex flex-wrap items-center space-x-1 md:space-x-2 font-medium">
            <span className="text-gray-300 px-1">{formatDateTime(item.dtEventTime)}</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-300">{formatDuration(item.DurationS)}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-1 w-full md:w-auto md:items-end">
        <div className="grid grid-cols-3 gap-1 md:gap-2 md:flex md:items-center md:space-x-4">
          <div className="flex flex-col items-center md:items-end">
            <span className="text-gray-400 text-[10px] md:text-sm mb-0.5 md:mb-1">击杀玩家</span>
            <span className="text-sm md:text-lg font-bold tracking-wider">{item.KillCount}</span>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-gray-400 text-[10px] md:text-sm mb-0.5 md:mb-1">收益</span>
            <span className="text-sm md:text-lg font-bold text-yellow-500 tracking-wider">
              {formatNumber(item.FinalPrice)}
            </span>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <span className="text-gray-400 text-[10px] md:text-sm mb-0.5 md:mb-1">净收益</span>
            <span
              className={`text-sm md:text-lg font-bold ${getStatusColor1(
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

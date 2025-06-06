import { useAppContext } from 'contexts/AppProvider';
import { seasonOptions } from 'common/const';

interface InfoFiltersProps {
  selectedMap?: string;
  setSelectedMap?: (value: string) => void;
  seasonid?: string;
  changeSeasonId?: (value: string) => void;
  ck: string;
  changeCk: (value: string) => void;
  dateOptions?: string[]; // 日期选项（YYYY-MM-DD）
  selectedDate?: string;
  setSelectedDate?: (value: string) => void;
}

export const InfoFilters = ({
  selectedMap,
  setSelectedMap,
  seasonid,
  changeSeasonId,
  ck,
  changeCk,
  selectedDate,
  setSelectedDate,
  dateOptions,
}: InfoFiltersProps) => {
  const context = useAppContext();
  const { ckOptions } = context;

  const mapOptions = selectedMap
    ? [
        { value: 'all', label: '全部地图' },
        ...(Object.entries(context?.mapName || {})
          ?.map(([value, label]) => ({
            value,
            label,
          }))
          .filter((item) => Number(item.value) > 1000) || []),
      ]
    : [];

  return (
    <div className="flex items-center space-x-2 mb-1 overflow-x-auto hide-scrollbar">
      {ckOptions && (
        <select
          value={ck}
          onChange={(e) => changeCk(e.target.value)}
          className="bg-gray-800 text-white pl-2 pr-1 py-1 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
        >
          {ckOptions
            ?.filter((item) => item.value !== 'custom')
            ?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      )}
      {seasonOptions && seasonid && (
        <select
          value={seasonid}
          onChange={(e) => changeSeasonId?.(e.target.value)}
          className="bg-gray-800 text-white pl-2 pr-1 py-1 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
        >
          {seasonOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {mapOptions && selectedMap && (
        <select
          value={selectedMap}
          onChange={(e) => setSelectedMap?.(e.target.value)}
          className="bg-gray-800 text-white pl-2 pr-1 py-1 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
        >
          {mapOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {dateOptions && selectedDate && (
        <select
          value={selectedMap}
          onChange={(e) => setSelectedDate?.(e.target.value)}
          className="bg-gray-800 text-white pl-2 pr-1 py-1 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
        >
          {dateOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

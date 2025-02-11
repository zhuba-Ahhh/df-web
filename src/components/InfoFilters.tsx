import { useContext } from 'react';
import { Context } from 'App';
import { ckOptions, seasonOptions } from 'common/const';

interface InfoFiltersProps {
  selectedMap: string;
  setSelectedMap: (value: string) => void;
  seasonid: string;
  changeSeasonId: (value: string) => void;
  ck: string;
  changeCk: (value: string) => void;
}

export const InfoFilters = ({
  selectedMap,
  setSelectedMap,
  seasonid,
  changeSeasonId,
  ck,
  changeCk,
}: InfoFiltersProps) => {
  const context = useContext(Context);

  const mapOptions = [
    { value: 'all', label: '全部地图' },
    ...Object.entries(context?.mapName || {})
      .map(([value, label]) => ({
        value,
        label,
      }))
      .filter((item) => Number(item.value) > 1000),
  ];

  return (
    <div className="flex items-center space-x-3 mb-2">
      {mapOptions && (
        <select
          value={selectedMap}
          onChange={(e) => setSelectedMap(e.target.value)}
          className="bg-gray-800 text-white pl-2 pr-1 py-1 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
        >
          {mapOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {seasonOptions && (
        <select
          value={seasonid}
          onChange={(e) => changeSeasonId(e.target.value)}
          className="bg-gray-800 text-white pl-2 pr-1 py-1 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
        >
          {seasonOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
      {ckOptions && (
        <select
          value={ck}
          onChange={(e) => changeCk(e.target.value)}
          className="bg-gray-800 text-white pl-2 pr-1 py-1 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
        >
          {ckOptions
            ?.filter((item) => item.value !== 'custom')
            .map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
        </select>
      )}
    </div>
  );
};

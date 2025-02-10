import { useContext, useEffect, useState } from 'react';
import type { JData } from '../types/info';
import { Context } from 'App';
import { fetchAssets } from 'services/info';

interface CareerCardProps {
  data?: JData;
}

export const CareerCard = ({ data }: CareerCardProps) => {
  const context = useContext(Context);
  const [assets, setAssets] = useState<[string, string, string]>();

  useEffect(() => {
    const getAssets = async () => {
      try {
        const res = await fetchAssets();
        if (res) {
          setAssets(res);
        }
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      }
    };
    getAssets();
  }, []);

  if (!data) return null;

  const { careerData, userData } = data;

  const getRank = (point: string) => {
    const rankPoint = Number(point);
    const rankMap = context?.rank || {};
    const ranks = Object.entries(rankMap).sort((a, b) => Number(a[0]) - Number(b[0]));

    for (const [threshold, rankName] of ranks) {
      if (rankPoint <= Number(threshold)) {
        return rankName;
      }
    }
    return rankMap['6000'] || '未知段位';
  };

  const formatDuration = (seconds: string) => {
    const totalMinutes = Math.floor(Number(seconds) / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes}m`;
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur p-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg border border-gray-700">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 overflow-hidden bg-gray-700">
            <img
              src={`https://playerhub.df.qq.com/playerhub/60004/object/${userData.picurl}.png`}
              alt={userData.charac_name}
              className="w-full h-full"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {decodeURIComponent(userData.charac_name)}
            </h2>
            <p className="text-gray-400">
              {context?.seasonOptions[0]} &nbsp;
              {getRank(careerData.rankpoint)} ({careerData.rankpoint})
            </p>
            {/* 资产展示 */}
            {assets && (
              <div className="flex items-center justify-between px-2 py-1 bg-gray-700/30 rounded-lg space-x-2">
                <div className="flex items-center space-x-2">
                  <img
                    src="https://game.gtimg.cn/images/dfm/cp/a20240807community/profile/fund_icon_01.png"
                    alt="三角币"
                    className="w-5 h-5"
                  />
                  <span className="text-yellow-500">{Number(assets[0]).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    src="https://game.gtimg.cn/images/dfm/cp/a20240807community/profile/fund_icon_02.png"
                    alt="三角券"
                    className="w-5 h-5"
                  />
                  <span className="text-blue-500">{Number(assets[1]).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    src="https://game.gtimg.cn/images/dfm/cp/a20240807community/swat/swat_gold_icon.png"
                    alt="哈夫币"
                    className="w-5 h-5"
                  />
                  <span className="text-green-500">{Number(assets[2]).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm text-gray-400">对局数</p>
          <p className="text-xl font-bold text-white">{careerData.soltotalfght}</p>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm text-gray-400">成功撤离</p>
          <p className="text-xl font-bold text-green-500">{careerData.solttotalescape}</p>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm text-gray-400">游戏时长</p>
          <p className="text-xl font-bold text-green-500">
            {formatDuration(careerData.solduration)}
          </p>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm text-gray-400">撤离率</p>
          <p className="text-xl font-bold text-green-500">{careerData.solescaperatio}</p>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm text-gray-400">击败干员</p>
          <p className="text-xl font-bold text-yellow-500">{careerData.soltotalkill}</p>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <p className="text-sm text-gray-400">KD</p>
          <p className="text-xl font-bold text-blue-500">
            {(Number(careerData.soltotalkill) / Number(careerData.soltotalfght)).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

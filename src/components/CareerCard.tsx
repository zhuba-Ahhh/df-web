import type { IPersonResource, JData } from '../types/info';
import { seasonOptions } from 'common/const';
import { useAppContext } from 'contexts/AppProvider';
import { formatDuration, getRank } from './utils';
import { formatNumberToKMB } from 'utils';

interface CareerCardProps {
  data?: JData;
  assets?: [string, string, string];
  personResource: IPersonResource;
}

const getPictureUrl = (picurl: string) => {
  // 判断是否可以转换成数字
  if (!Number.isNaN(Number(picurl))) {
    return `https://playerhub.df.qq.com/playerhub/60004/object/${picurl}.png`;
  } else {
    return decodeURIComponent(picurl);
  }
};

export const CareerCard = ({ data, assets, personResource }: CareerCardProps) => {
  const context = useAppContext();
  const season = seasonOptions.find((item) => item.value === context?.seasonid)?.label;

  if (!data || !data?.careerData || !data?.userData) return null;

  const { careerData, userData } = data;

  const kd = personResource
    ? `${Number(personResource.lowKillDeathRatio) / 100}/${Number(personResource.medKillDeathRatio) / 100}/${Number(personResource.highKillDeathRatio) / 100}`
    : (Number(careerData.soltotalkill) / Number(careerData.soltotalfght)).toFixed(2);

  return (
    <div className="bg-gray-800/80 backdrop-blur p-2 md:3 rounded-xl md:rounded-2xl shadow-lg border border-gray-700">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 overflow-hidden bg-gray-700">
            <img
              src={getPictureUrl(userData?.picurl)}
              alt={userData?.charac_name}
              className="w-full h-full"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {decodeURIComponent(userData?.charac_name)}
            </h2>
            <p className="text-sm text-gray-400">
              {season}赛季 &nbsp;
              {getRank(careerData?.rankpoint, context.rank || {})} ({careerData?.rankpoint})
            </p>
            {/* 资产展示 */}
            {assets && (
              <div className="flex items-center justify-between px-2 py-1 bg-gray-700/30 rounded-lg space-x-2">
                <div className="flex items-center space-x-2">
                  <img
                    src="https://game.gtimg.cn/images/dfm/cp/a20240807community/profile/fund_icon_01.png"
                    alt="三角币"
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-yellow-500">
                    {Number(assets[0]).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    src="https://game.gtimg.cn/images/dfm/cp/a20240807community/profile/fund_icon_02.png"
                    alt="三角券"
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-blue-500">
                    {Number(assets[1]).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    src="https://game.gtimg.cn/images/dfm/cp/a20240807community/swat/swat_gold_icon.png"
                    alt="哈夫币"
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-green-500">
                    {Number(assets[2]).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-2">
        <div className="bg-gray-700/50 p-2 rounded-lg">
          <p className="text-xs text-gray-400">对局数</p>
          <p className="text-sm font-bold text-white">{careerData.soltotalfght}</p>
        </div>
        <div className="bg-gray-700/50 p-2 rounded-lg">
          <p className="text-xs text-gray-400">成功撤离</p>
          <p className="text-sm font-bold text-green-500">{careerData.solttotalescape}</p>
        </div>
        <div className="bg-gray-700/50 p-2 rounded-lg">
          <p className="text-xs text-gray-400">游戏时长</p>
          <p className="text-sm font-bold text-green-500">
            {formatDuration(careerData.solduration)}
          </p>
        </div>
        <div className="bg-gray-700/50 p-2 rounded-lg">
          <p className="text-xs text-gray-400">撤离率</p>
          <p className="text-sm font-bold text-green-500">{careerData.solescaperatio}</p>
        </div>
        <div className="bg-gray-700/50 p-2 rounded-lg">
          <p className="text-xs text-gray-400">击败干员</p>
          <p className="text-sm font-bold text-yellow-500">{careerData.soltotalkill}</p>
        </div>
        <div className="bg-gray-700/50 p-2 rounded-lg">
          <p className="text-xs text-gray-400">KD</p>
          <p className="text-sm font-bold text-blue-500">{kd}</p>
        </div>
        {personResource && (
          <>
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <p className="text-xs text-gray-400">赚损比</p>
              <p className="text-sm font-bold  text-green-500">
                {formatNumberToKMB(Number(personResource?.profitLossRatio) / 100)}
              </p>
            </div>
            <div className="bg-gray-700/50 p-2 rounded-lg">
              <p className="text-xs text-gray-400">收益</p>
              <p className="text-sm font-bold  text-green-500">
                {formatNumberToKMB(Number(personResource?.totalGainedPrice))}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { getYesterdayProfit, IYesterdayProfit, List as ProfitListItem } from '../services/info';
import { colors } from 'common/const';
import { getObjectDetails, List } from 'services/props';

interface YesterdayProfitCardProps {
  ck?: string;
}

const YesterdayProfitCard: React.FC<YesterdayProfitCardProps> = ({ ck }) => {
  const [profitData, setProfitData] = useState<IYesterdayProfit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topItems, setTopItems] = useState<List[]>([]);

  useEffect(() => {
    if (!ck) {
      setProfitData(null); // 清除旧数据
      setLoading(false);
      // setError("未提供用户标识 (CK)。"); // 可以选择不显示错误，或者仅在初次加载后无数据时提示
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getYesterdayProfit(ck);
        if (data && data.solDetail) {
          setProfitData(data);
          const objectIDs = data.solDetail.userCollectionTop.list.map(
            (item: ProfitListItem) => item.objectID
          );

          const list = await getObjectDetails(ck, objectIDs);
          setTopItems(list || []);
        } else {
          setProfitData(null); // 清除旧数据
          // setError('未能获取昨日收益数据。'); // 或者显示无数据
        }
      } catch (err) {
        setProfitData(null); // 清除旧数据
        setError('获取数据时发生错误。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ck]);

  if (loading || error || !profitData) {
    return null;
  }

  const { recentGain, recentGainDate, userCollectionTop } = profitData.solDetail;

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 8) return dateStr; // YYYYMMDD
    return `${dateStr.substring(4, 6)}月${dateStr.substring(6, 8)}日`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-2 md:p-3 md:rounded-2xl shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <h3 className="text-md font-semibold text-gray-100 mr-1">昨日收益</h3>
          <p className="text-xs text-gray-400">{formatDate(recentGainDate)}</p>
        </div>
        <div>
          <h3
            className={`text-md font-semibold text-gray-100 ${recentGain > 0 ? 'text-green-400' : 'text-red-400'}`}
          >
            {recentGain.toLocaleString()}
          </h3>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        {userCollectionTop?.list?.map((item) => {
          const currentItem = topItems.find((i) => String(i.objectID) === item.objectID);
          if (!currentItem) {
            return null;
          }

          return (
            <div
              key={item.objectID}
              className="flex flex-col items-center bg-gray-700 p-2 rounded-md shadow relative"
              style={{ backgroundColor: colors[Number(currentItem.grade || 0) - 1] }}
            >
              <img
                src={currentItem.pic}
                alt={currentItem.desc}
                className="w-8 h-8 md:w-12 md:h-12 object-contain mb-1 rounded"
              />
              <span
                className="text-xs text-gray-300 truncate w-full text-center"
                title={currentItem.desc}
              >
                {currentItem.objectName}
              </span>
              <span className={`text-xs text-yellow-400 font-semibold`}>
                {parseInt(item?.price || '').toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 absolute right-1 top-1">
                x{item?.count || 0}
              </span>
            </div>
          );
        })}
        {topItems.length < 3 &&
          Array.from({ length: 3 - topItems.length }).map((_, idx) => (
            <div
              key={`placeholder-${idx}`}
              className="flex flex-col items-center bg-gray-700 p-2 rounded-md shadow opacity-60"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-600 rounded mb-1 flex items-center justify-center">
                <span className="text-gray-500 text-xl">?</span>
              </div>
              <span className="text-xs text-gray-300">-</span>
              <span className="text-xs text-gray-400">-</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export { YesterdayProfitCard };

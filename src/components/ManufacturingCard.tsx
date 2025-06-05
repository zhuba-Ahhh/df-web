import React, { useEffect, useState } from 'react';
import { getManufacturingDetails } from '../services/info';
import type { IManufacturingDetails, PlaceDatum } from '../types/info';
import { formatCountdown } from '../utils/math'; // 导入倒计时格式化函数
import { colors } from 'common/const';

interface ManufacturingCardProps {
  ck: string;
}

// 站台图标映射 (可根据实际情况替换为真实图标组件或URL)
const stationIcons: Record<string, string> = {
  技术中心: '💻', // 技术中心
  工作台: '🛠️', // 工作台
  制药台: '🧪', // 制药台
  防具台: '🛡️', // 防具台
};

// 新增：倒计时组件
interface CountdownTimerProps {
  initialSeconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialSeconds }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    // 如果初始秒数小于等于0，则不启动计时器
    if (initialSeconds <= 0) {
      setSecondsLeft(0);
      return;
    }

    setSecondsLeft(initialSeconds); // 确保当 initialSeconds 变化时，计时器重置

    const intervalId = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if (prevSeconds <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    // 清理函数：组件卸载或 initialSeconds 变化时清除计时器
    return () => clearInterval(intervalId);
  }, [initialSeconds]); // 依赖于 initialSeconds，当它改变时，计时器会重置

  return <span className="text-xs">{formatCountdown(secondsLeft)}</span>;
};

export const ManufacturingCard: React.FC<ManufacturingCardProps> = ({ ck }) => {
  const [data, setData] = useState<IManufacturingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ck) {
      setLoading(false);
      setError('未提供CK');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getManufacturingDetails(ck);
        setData(result);
      } catch (err) {
        console.error('获取制造详情失败:', err);
        setError('获取制造详情失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ck]);

  if (loading || error || !data || !data.placeData || data.placeData?.length === 0) {
    return null;
  }

  const { relateMap, placeData } = data;
  const activePlaceData = placeData.filter((p) => p.Status);

  return (
    <div className="bg-gray-800/80 backdrop-blur p-2 md:p-3 rounded-xl shadow-lg border border-gray-700 text-white">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-base font-semibold">特勤处制造</h4>
      </div>
      {activePlaceData.length > 0 ? (
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
          {activePlaceData.map((item: PlaceDatum) => {
            const itemInfo = item.Status !== '闲置中' ? relateMap?.[item.objectId] : null;
            const itemName = itemInfo?.objectName;
            const itemImage = itemInfo?.pic || `https://game.gtimg.cn/images/dfm/favicon.ico`;

            return (
              <div
                key={item.Id}
                className="bg-gray-700/50 p-2 rounded-lg flex flex-col items-center text-center"
                style={{
                  backgroundColor: itemInfo ? colors[Number(itemInfo?.grade || 0) - 1] : '#374151',
                }}
              >
                <div className="flex items-center self-start mb-1">
                  <span className="text-xs mr-1">{stationIcons[item.placeName] || '🏭'}</span>
                  <span className="text-xs font-medium text-gray-300">
                    {item.placeName} Lv.{item.Level}
                  </span>
                </div>
                <img src={itemImage} alt={itemName} className="w-8 h-8 object-contain my-1" />
                <p className="text-xs text-gray-200 truncate w-full" title={itemName}>
                  {itemName}
                </p>
                {item.Status && item.leftTime > 0 ? (
                  <div className="flex items-center text-xs text-gray-400 mt-1">
                    <span className="mr-1 text-xs">🔧</span>
                    <CountdownTimer initialSeconds={item.leftTime} />
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">空闲中</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-4">当前没有正在进行的制造任务。</p>
      )}
    </div>
  );
};

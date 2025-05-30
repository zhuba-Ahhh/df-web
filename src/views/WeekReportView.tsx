import { useState, useEffect, useCallback } from 'react';
import { InfoFilters } from '../components/InfoFilters';
import dayjs from 'dayjs';
import { fetchWeekRecord, WeekRecord } from 'services/week';
import { useInfoData } from 'hooks/useInfoData';
import { formatDuration, getRank } from 'components/utils';
import { useAppContext } from 'contexts/AppProvider';
import TopCollectiblesView from '../components/TopCollectiblesView'; // 新增导入

// 定义从 context.collection 中获取的物品详情类型
export interface CollectionItemDetails {
  // 保持导出，因为 TopCollectiblesView 会用到
  name: string;
  img?: string;
  grade?: string;
}

// 定义 context.collection 的类型结构 (如果 TopCollectiblesView 也用这个，可以考虑移到共享类型文件)
interface CollectionData {
  [itemid: string]: CollectionItemDetails; // itemid is a string key
}

// 生成最近5个周日的日期（格式YYYY-MM-DD）
const getRecentSundays = () => {
  const sundays: string[] = [];
  let current = dayjs();
  while (sundays.length < 5) {
    if (current.day() === 0) {
      // 周日是0（dayjs中0=周日）
      sundays.push(current.format('YYYYMMDD'));
    }
    current = current.subtract(1, 'day');
  }
  return sundays; // 按时间顺序排列
};

// 更新 parseDailyData 函数
const parseDailyData = (rawData: string[]) => {
  if (!rawData || rawData.length === 0 || (rawData.length === 1 && rawData[0] === '')) {
    return [];
  }
  return rawData?.map((item) => {
    const parts = item.split('-');
    if (parts.length < 3) {
      console.warn('Malformed daily data item:', item);
      return { date: '无效数据', weekday: '', totalPriceFormatted: 'N/A', totalPriceRaw: 0 };
    }
    const [weekday, dateStr, priceStr] = parts;
    const price = Number(priceStr);
    if (isNaN(price)) {
      console.warn('Invalid price in daily data item:', item);
      return { date: '无效数据', weekday: '', totalPriceFormatted: 'N/A', totalPriceRaw: 0 };
    }
    return {
      date:
        dateStr && dateStr.length === 8
          ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
          : dateStr || '未知日期',
      weekday: weekday || '未知',
      totalPriceFormatted: price.toLocaleString(),
      totalPriceRaw: price,
    };
  });
};

const WeekReportView = () => {
  const [selectedDate, setSelectedDate] = useState(getRecentSundays()[0] || '');
  const [reportData, setReportData] = useState<WeekRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const { ck, changeCk } = useInfoData();
  const context = useAppContext();

  // 获取周报数据
  const fetchWeekReport = useCallback(async () => {
    if (!ck) return;
    setLoading(true);
    try {
      const res = await fetchWeekRecord(ck, selectedDate);
      setReportData(res);
    } finally {
      setLoading(false);
    }
  }, [ck, selectedDate]);

  useEffect(() => {
    fetchWeekReport();
  }, [selectedDate, fetchWeekReport]);

  // Helper to parse and format numbers from reportData
  const getFormattedNumber = (value: string | undefined, decimalPlaces?: number) => {
    const num = parseFloat(value || '');
    if (isNaN(num)) return 'N/A';
    return decimalPlaces !== undefined ? num.toFixed(decimalPlaces) : num.toLocaleString();
  };

  return (
    <div className="p-4 md:p-6 bg-gray-900 text-white min-h-screen">
      <InfoFilters
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        ck={ck}
        changeCk={changeCk}
        dateOptions={getRecentSundays()}
      />

      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-4 text-gray-400">加载中...</span>
        </div>
      ) : reportData ? (
        (() => {
          const gainedPrice = parseFloat(reportData.Gained_Price) || 0;
          const consumePrice = parseFloat(reportData.consume_Price) || 0;
          const netIncome = consumePrice - gainedPrice;

          const dailyPricesData = reportData.Total_Price ? reportData.Total_Price.split(',') : [];
          const parsedDailyPrices = parseDailyData(dailyPricesData);
          const sundayWarehouseValue =
            parsedDailyPrices.length > 0
              ? parsedDailyPrices[parsedDailyPrices.length - 1].totalPriceRaw
              : 0;

          // 移除此处的 topCollectibles 计算

          return (
            <div className="mt-8 space-y-6">
              {/* Section 1: Financial Summary */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-4 text-gray-100">行动数据</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {' '}
                  {/* <--- 修改在这里 */}
                  <div className="flex flex-col p-3 bg-gray-700 rounded-md">
                    <span className="text-sm text-gray-400">本周总带入</span>
                    <span className="text-lg font-medium text-green-400">
                      {gainedPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col p-3 bg-gray-700 rounded-md">
                    <span className="text-sm text-gray-400">本周总带出</span>
                    <span className="text-lg font-medium text-red-400">
                      {consumePrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col p-3 bg-gray-700 rounded-md">
                    <span className="text-sm text-gray-400">本周净收益</span>
                    <span
                      className={`text-lg font-medium ${netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {netIncome.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col p-3 bg-gray-700 rounded-md">
                    <span className="text-sm text-gray-400">周日仓库价值最高</span>
                    <span className="text-lg font-medium text-yellow-400">
                      {sundayWarehouseValue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* New Section for Top Collectibles */}
              <div className="bg-gray-800 rounded-lg p-4">
                <TopCollectiblesView
                  carryOutListStr={reportData.CarryOut_highprice_list}
                  collectionData={context?.allCollectsMap as CollectionData | undefined} // 确保类型匹配
                />
              </div>

              {/* Section 2: Detailed Stats Grid (TopCollectiblesView removed from here) */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-800 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-300">排名分数</span>
                  <span className="text-lg font-medium">
                    {getRank(reportData.Rank_Score, context.rank || {})} ({reportData.Rank_Score})
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-300">百万撤离（次）</span>
                  <span className="text-lg font-medium">
                    {reportData.GainedPrice_overmillion_num}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-300">Boss击杀</span>
                  <span className="text-lg font-medium">
                    {getFormattedNumber(reportData.total_Kill_Boss)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-300">玩家击杀</span>
                  <span className="text-lg font-medium">
                    {getFormattedNumber(reportData.total_Kill_Player)}
                  </span>
                </div>
                {/* <div className="flex flex-col">
                  <span className="text-sm text-gray-300">总死亡次数</span>
                  <span className="text-lg font-medium">
                    {getFormattedNumber(reportData.total_Death_Count)}
                  </span>
                </div> */}
                {/* <div className="flex flex-col">
                  <span className="text-sm text-gray-300">总移动距离（公里）</span>
                  <span className="text-lg font-medium">
                    {Number(getFormattedNumber(reportData.Total_Mileage, 1)) / 10000 / 100}
                  </span>
                </div> */}
                <div className="flex flex-col">
                  <span className="text-sm text-gray-300">总游戏时长（小时）</span>
                  <span className="text-lg font-medium">
                    {formatDuration(reportData.total_Online_Time)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-300">总场数（场）</span>
                  <span className="text-lg font-medium">{reportData.total_sol_num}</span>
                </div>
                {/* TopCollectiblesView was here, now moved out */}
                {/* <div className="flex flex-col">
                  <span className="text-sm text-gray-300">总移动距离（公里）</span>
                  <span className="text-lg font-medium">
                    {Number(getFormattedNumber(reportData.Total_Mileage, 1)) / 10000 / 100}
                  </span>
                </div> */}
              </div>

              {/* Section 3: Daily Price List */}
              {parsedDailyPrices.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4 text-gray-100">本周每日仓库价值</h3>
                  <div className="space-y-2">
                    {parsedDailyPrices.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center px-4 py-3 bg-gray-700 rounded-lg"
                      >
                        <div>
                          <span className="text-sm text-gray-300">{item.date}</span>
                          <span className="ml-2 text-xs text-gray-400">({item.weekday})</span>
                        </div>
                        <span className="text-base font-medium text-gray-100">
                          {item.totalPriceFormatted}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()
      ) : (
        <div className="mt-8 text-center text-gray-400">无本周数据记录</div>
      )}
    </div>
  );
};

export { WeekReportView };

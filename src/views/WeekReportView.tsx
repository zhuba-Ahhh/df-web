import { useState, useEffect, useCallback } from 'react';
import { InfoFilters } from '../components/InfoFilters';
import dayjs from 'dayjs';
import { fetchWeekRecord, WeekRecord } from 'services/week';
import { useInfoData } from 'hooks/useInfoData';
import { formatDuration, getRank } from 'components/utils';
import { useAppContext } from 'contexts/AppProvider';
import TopCollectiblesView from '../components/TopCollectiblesView';
import { AppContextType } from 'contexts/AppContext';
import { weekdayMap } from '../common/const';

export interface CollectionItemDetails {
  name: string;
  img?: string;
  grade?: string;
}

interface CollectionData {
  [itemid: string]: CollectionItemDetails;
}

const getFormattedNumber = (value: string | undefined, decimalPlaces?: number) => {
  const num = parseFloat(value || '');
  if (isNaN(num)) return 'N/A';
  return decimalPlaces !== undefined ? num.toFixed(decimalPlaces) : num.toLocaleString();
};

const getRecentSundays = () => {
  const sundays: string[] = [];
  let current = dayjs();
  while (sundays.length < 5) {
    if (current.day() === 0) {
      sundays.push(current.format('YYYYMMDD'));
    }
    current = current.subtract(1, 'day');
  }
  return sundays;
};

const parseDailyData = (rawData: string[]) => {
  if (!rawData || rawData.length === 0 || (rawData.length === 1 && rawData[0] === '')) {
    return [];
  }
  return rawData?.map((item) => {
    const parts = item.split('-');
    if (parts.length < 3) {
      console.warn('Malformed daily data item:', item);
      return {
        date: '无效数据',
        weekday: '',
        weekdayEn: '',
        totalPriceFormatted: 'N/A',
        totalPriceRaw: 0,
      };
    }
    const [weekday, dateStr, priceStr] = parts;
    const price = Number(priceStr);
    if (isNaN(price)) {
      console.warn('Invalid price in daily data item:', item);
      return {
        date: '无效数据',
        weekday: '',
        weekdayEn: '',
        totalPriceFormatted: 'N/A',
        totalPriceRaw: 0,
      };
    }
    const weekdayEn = weekdayMap.find((wd) => wd.value === weekday)?.key || weekday;
    return {
      date:
        dateStr && dateStr.length === 8
          ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`
          : dateStr || '未知日期',
      weekday: weekday || '未知',
      weekdayEn: weekdayEn,
      totalPriceFormatted: price.toLocaleString(),
      totalPriceRaw: price,
    };
  });
};

const calculateNetIncome = (parsedDailyPrices: ReturnType<typeof parseDailyData>) => {
  if (parsedDailyPrices.length === 0) return { netIncome: 0, maxItem: null }; // 返回最大值项

  // 计算每日仓库价值的最大项
  const maxItem = parsedDailyPrices.reduce(
    (max, item) => (item.totalPriceRaw > max.totalPriceRaw ? item : max),
    parsedDailyPrices[0]
  );
  const minItem = parsedDailyPrices.reduce(
    (min, item) => (item.totalPriceRaw < min.totalPriceRaw ? item : min),
    parsedDailyPrices[0]
  );

  const maxDate = dayjs(maxItem.date);
  const minDate = dayjs(minItem.date);
  const isMinAfterMax = minDate.isAfter(maxDate);
  const netIncome = isMinAfterMax
    ? -(maxItem.totalPriceRaw - minItem.totalPriceRaw)
    : maxItem.totalPriceRaw - minItem.totalPriceRaw;

  return { netIncome, maxItem }; // 返回最大值项
};

const renderActionDataGrid = ({
  consumePrice,
  gainedPrice,
  netIncome,
  maxItem, // 接收最大值项
}: {
  consumePrice: number;
  gainedPrice: number;
  netIncome: number;
  maxItem: ReturnType<typeof parseDailyData>[number] | null;
}) => (
  <div className="grid grid-cols-2 gap-x-3 gap-y-2">
    <div className="flex flex-col p-3 bg-gray-700 rounded-md">
      <span className="text-sm text-gray-400">本周总带入</span>
      <span className="text-lg font-medium text-green-400">{consumePrice.toLocaleString()}</span>
    </div>
    <div className="flex flex-col p-3 bg-gray-700 rounded-md">
      <span className="text-sm text-gray-400">本周总带出</span>
      <span className="text-lg font-medium text-red-400">{gainedPrice.toLocaleString()}</span>
    </div>
    <div className="flex flex-col p-3 bg-gray-700 rounded-md">
      <span className="text-sm text-gray-400">本周净收益</span>
      <span className={`text-lg font-medium ${netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {netIncome.toLocaleString()}
      </span>
    </div>
    <div className="flex flex-col p-3 bg-gray-700 rounded-md">
      <span className="text-sm text-gray-400">
        {maxItem ? `${maxItem.weekdayEn}价值最高` : '本周价值最高'}
      </span>
      <span className="text-lg font-medium text-yellow-400">
        {maxItem ? maxItem.totalPriceFormatted : 'N/A'}
      </span>
    </div>
  </div>
);

const renderStatisticsGrid = (reportData: WeekRecord, context: AppContextType) => (
  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-3 bg-gray-800 rounded-lg">
    <div className="flex flex-col">
      <span className="text-sm text-gray-300">排名分数</span>
      <span className="text-lg font-medium">
        {getRank(reportData.Rank_Score, context.rank || {})} ({reportData.Rank_Score})
      </span>
    </div>
    <div className="flex flex-col">
      <span className="text-sm text-gray-300">百万撤离（次）</span>
      <span className="text-lg font-medium">{reportData.GainedPrice_overmillion_num}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-sm text-gray-300">Boss击杀</span>
      <span className="text-lg font-medium">{getFormattedNumber(reportData.total_Kill_Boss)}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-sm text-gray-300">玩家击杀</span>
      <span className="text-lg font-medium">
        {getFormattedNumber(reportData.total_Kill_Player)}
      </span>
    </div>
    <div className="flex flex-col">
      <span className="text-sm text-gray-300">总游戏时长（小时）</span>
      <span className="text-lg font-medium">{formatDuration(reportData.total_Online_Time)}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-sm text-gray-300">总场数（场）</span>
      <span className="text-lg font-medium">{reportData.total_sol_num}</span>
    </div>
  </div>
);

const WeekReportView = () => {
  const [selectedDate] = useState(getRecentSundays()[0] || '');
  const [reportData, setReportData] = useState<WeekRecord | null>(null);
  const [loading, setLoading] = useState(false);

  const { ck, changeCk } = useInfoData();
  const context = useAppContext();

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

  return (
    <div className="p-3 md:p-6 bg-gray-900 text-white min-h-screen">
      <InfoFilters
        // selectedDate={selectedDate}
        // setSelectedDate={setSelectedDate}
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

          const dailyPricesData = reportData.Total_Price ? reportData.Total_Price.split(',') : [];
          const parsedDailyPrices = parseDailyData(dailyPricesData);
          const { netIncome, maxItem } = calculateNetIncome(parsedDailyPrices);

          return (
            <div className="mt-2 space-y-2">
              <div className="bg-gray-800 rounded-lg p-3">
                <h3 className="text-xl font-semibold mb-2 text-gray-100">行动数据</h3>
                {renderActionDataGrid({
                  consumePrice,
                  gainedPrice,
                  netIncome,
                  maxItem, // 传递最大值项
                })}
              </div>

              <div className="bg-gray-800 rounded-lg p-3">
                <TopCollectiblesView
                  carryOutListStr={reportData.CarryOut_highprice_list}
                  collectionData={context?.allCollectsMap as CollectionData | undefined}
                />
              </div>

              {renderStatisticsGrid(reportData, context)}

              {parsedDailyPrices.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-3">
                  <h3 className="text-lg font-medium mb-4 text-gray-100">本周每日仓库价值</h3>
                  <div className="space-y-2">
                    {parsedDailyPrices.map((item, index, arr) => {
                      // 计算与前一日的差值（首日差值为0）
                      const prevPrice = index > 0 ? arr[index - 1].totalPriceRaw : 0;
                      const difference = item.totalPriceRaw - prevPrice;

                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center px-3 py-2 bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-1">
                            <span className="text-base text-gray-300">{item.date.slice(5)}</span>
                            <span className="ml-2 text-base text-gray-400">({item.weekdayEn})</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {index > 0 && (
                              <span
                                className={`text-sm font-medium ${
                                  difference >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}
                              >
                                {difference >= 0 ? '+' : ''}
                                {difference.toLocaleString()}
                              </span>
                            )}
                            <span className="text-base font-medium text-gray-100">
                              {item.totalPriceFormatted}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })()
      ) : (
        <div className="mt-4 text-center text-gray-400">无本周数据记录</div>
      )}
    </div>
  );
};

export { WeekReportView };

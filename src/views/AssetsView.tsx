import { useEffect, useMemo, useState } from 'react';
import { Line } from '@ant-design/plots';
import { AssetData, getLocalAssets } from 'services/info';

const timeGapOptions = [
  { value: 30, label: '30分钟' },
  { value: 60, label: '1小时' },
  { value: 120, label: '2小时' },
  { value: 240, label: '4小时' },
  { value: 480, label: '8小时' },
  { value: 1920, label: '24小时' },
];

export const AssetsView = () => {
  const [data, setData] = useState<AssetData[]>([]);
  const [timeGap, setTimeGap] = useState(30); // 默认30分钟

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLocalAssets();
        if (response && response?.length > 0) {
          setData(response);
        }
      } catch (error) {
        console.error('获取资产数据失败:', error);
      }
    };

    fetchData();
  }, []);

  const config = useMemo(
    () => ({
      data: data.flatMap((item) =>
        item.records.map((record) => ({
          label: item.label,
          timestamp: new Date(record.timestamp),
          value: Number(record.data[2]),
        }))
      ),
      xField: 'timestamp',
      yField: 'value',
      seriesField: 'label',
      smooth: true,
      animation: true,
      xAxis: {
        type: 'time',
        tickCount: 5,
        label: {
          formatter: (v: string) => new Date(v).toLocaleString('zh-CN'),
          style: {
            fill: '#fff',
          },
        },
      },
      yAxis: {
        tickCount: 5,
        label: {
          style: {
            fill: '#fff',
          },
        },
      },
      point: {
        size: 4,
        style: {
          stroke: '#fff',
          lineWidth: 1,
        },
      },
      legend: {
        position: 'top-right',
        itemName: {
          style: {
            fill: '#fff',
          },
        },
      },
      theme: {
        styleSheet: {
          backgroundColor: 'transparent',
        },
      },
    }),
    [data]
  );

  return (
    <div className="p-4 md:p-6 text-white min-h-screen">
      <div className="mb-4">
        <select
          value={timeGap}
          onChange={(e) => setTimeGap(Number(e.target.value))}
          className="bg-gray-800 text-white pl-2 pr-1 py-1 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
        >
          {timeGapOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full h-[400px]  p-4 rounded-xl shadow-lg">
        {data.length > 0 && <Line {...config} />}
      </div>
    </div>
  );
};

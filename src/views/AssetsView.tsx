import { useEffect, useMemo, useState } from 'react';
import { Line, LineConfig } from '@ant-design/charts';
import { AssetData, getLocalAssets } from 'services/info';
import dayjs from 'dayjs';

export const AssetsView = () => {
  const [data, setData] = useState<AssetData[]>([]);

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

  const config: LineConfig = useMemo(
    () => ({
      data: data.flatMap((item) =>
        item.records.map((record) => ({
          label: item.label,
          timestamp: dayjs(record.timestamp).format('MM-DD HH:mm'),
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
        shape: 'circle',
        style: {
          stroke: '#fff',
          lineWidth: 1,
          fill: '#1890ff',
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
      tooltip: {},
      slider: {
        start: 0,
        end: 1,
        height: 20,
        x: {},
        y: { labelFormatter: '~s' },
        trendCfg: {
          backgroundStyle: {
            fill: '#363636',
          },
        },
        foregroundStyle: {
          fill: '#1890ff',
          fillOpacity: 0.3,
        },
        handlerStyle: {
          fill: '#1890ff',
          opacity: 1,
          width: 20,
          height: 20,
        },
        textStyle: {
          fill: '#fff',
        },
      },
    }),
    [data]
  );

  return (
    <div className="pt-24 md:p-6 text-white min-h-screen flex justify-center">
      <div className="w-full h-[400px]  p-4 rounded-xl shadow-lg">
        {data.length > 0 && <Line {...config} />}
      </div>
    </div>
  );
};

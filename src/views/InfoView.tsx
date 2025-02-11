/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useRef, useContext, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { PullStatus, PullToRefreshify } from 'react-pull-to-refreshify';
import { fetchInfo, fetchSeason, fetchAssets } from '../services/info';
import { InfoCard } from '../components/InfoCard';
import { CareerCard } from '../components/CareerCard';
import { useNavigate } from 'react-router-dom';
import type { Datum, JData, TeammateArr } from '../types/info';
import { Context } from 'App';
import { ckOptions, seasonOptions } from 'common/const';

const renderText = (pullStatus: PullStatus, percent: number) => {
  switch (pullStatus) {
    case 'pulling':
      return (
        <div>
          {`下拉即可刷新 `}
          <span style={{ color: 'green' }}>{`${percent.toFixed(0)}%`}</span>
        </div>
      );
    case 'canRelease':
      return '释放即可刷新...';
    case 'refreshing':
      return '刷新中';
    case 'complete':
      return '刷新成功';
    default:
      return '';
  }
};

const InfoView = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: InViewRef, inView } = useInView();

  const [data, setData] = useState<Datum[]>([]);
  const [careerData, setCareerData] = useState<JData>();
  const [assets, setAssets] = useState<[string, string, string]>();
  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isFetchList, setIsFetchList] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const [selectedMap, setSelectedMap] = useState<string>('all');
  const context = useContext(Context);
  const [seasonid, setSeasonid] = useState(context?.seasonid || '3');
  const [ck, setCk] = useState(context?.ck || ckOptions[0].value);

  const mapOptions = [
    { value: 'all', label: '全部地图' },
    ...Object.entries(context?.mapName || {})
      .map(([value, label]) => ({
        value,
        label,
      }))
      .filter((item) => Number(item.value) > 1000),
  ];

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (selectedMap === 'all') return true;
      return item.MapId === selectedMap;
    });
  }, [data, selectedMap]);

  const fetchAssetData = useCallback(
    async (newCk?: string) => {
      try {
        const res = await fetchAssets(newCk || ck);
        if (res) {
          setAssets(res);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      }
    },
    [ck]
  );

  const fetchCareerData = useCallback(
    async (seasonid?: string, newCk?: string) => {
      try {
        const res = await fetchSeason(seasonid, newCk || ck);
        // 确保 res 不为空数组时才更新状态
        if (res) {
          setCareerData(res);
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch career data:', error);
      }
    },
    [ck]
  );

  const fetchAccessories = useCallback(
    async (currentPage: number, newCk?: string) => {
      setLoading(currentPage === 1);
      setIsFetchList(true);
      try {
        const res = await fetchInfo(currentPage.toString(), newCk || ck);
        setData((prev) => {
          const newData = currentPage === 1 ? res : [...prev, ...res];
          return newData;
        });
        if (!res || res.length < 50) {
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setIsFetchList(false);
      }
    },
    [ck]
  );

  useEffect(() => {
    fetchCareerData('3');
    fetchAssetData();
    fetchAccessories(1);
  }, []);

  // 监听页码变化，加载新数据
  useEffect(() => {
    if (page > 1) {
      fetchAccessories(page);
    }
  }, [page, fetchAccessories]);

  useEffect(() => {
    if (inView && !isFetchList) {
      setPage((prev) => prev + 1);
    }
  }, [inView]);

  const changeCk = useCallback(
    (newCk: string) => {
      localStorage.setItem('ck', newCk);
      context?.updateConfig?.({ ck: newCk });
      setCk(newCk);
      setData([]);
      setPage(1);
      setHasMore(true);
      Promise.all([
        fetchCareerData(seasonid, newCk),
        fetchAccessories(1, newCk),
        fetchAssetData(newCk),
      ]);
    },
    [seasonid, fetchCareerData, fetchAccessories, fetchAssetData]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400">加载中...</span>
        </div>
      </div>
    );
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await Promise.all([fetchCareerData(), fetchAccessories(1), fetchAssetData()]);
    setRefreshing(false);
  };

  const handleCardClick = (newData: TeammateArr[]) => {
    context?.updateConfig?.({ teammateArr: newData });
    navigate(`/match`);
  };

  return (
    <PullToRefreshify refreshing={refreshing} onRefresh={handleRefresh} renderText={renderText}>
      <div
        ref={containerRef}
        className="flex flex-col space-y-2 md:space-y-6 p-4 md:p-6 bg-gray-900 text-white min-h-screen overflow-y-auto"
      >
        <div className="flex items-center space-x-2 mb-2">
          {mapOptions && (
            <select
              value={selectedMap}
              onChange={(e) => {
                setSelectedMap(e.target.value);
              }}
              className="bg-gray-800 text-white px-2 py-1 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
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
              onChange={(e) => {
                const newSeasonId = e.target.value;
                localStorage.setItem('seasonid', newSeasonId);
                context?.updateConfig?.({ seasonid: newSeasonId });
                setSeasonid(newSeasonId);
                fetchCareerData(newSeasonId);
              }}
              className="bg-gray-800 text-white px-2 py-1 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
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
              onChange={(e) => {
                const newCk = e.target.value;

                changeCk(newCk);
              }}
              className="bg-gray-800 text-white px-2 py-1 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
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

        {careerData && <CareerCard data={careerData} assets={assets} />}

        {filteredData?.map((item, index) => (
          <div
            key={item.dtEventTime + index}
            onClick={() => handleCardClick(item.teammateArr)}
            className="cursor-pointer pt-1"
          >
            <InfoCard item={item} />
          </div>
        ))}

        {inView && hasMore && (
          <div className="flex justify-center pt-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div ref={InViewRef} style={{ height: '1px' }} />

        {!hasMore && filteredData.length > 0 && (
          <div className="text-center text-gray-500 pb-4">没有更多数据了</div>
        )}
      </div>
    </PullToRefreshify>
  );
};

export { InfoView };

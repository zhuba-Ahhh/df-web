import { useEffect, useState, useCallback, useRef, useContext } from 'react';
import { useInView } from 'react-intersection-observer';
import { PullStatus, PullToRefreshify } from 'react-pull-to-refreshify';
import { fetchInfo, fetchSeason, fetchAssets } from '../services/info';
import { InfoCard } from '../components/InfoCard';
import { CareerCard } from '../components/CareerCard';
import type { Datum, JData } from '../types/info';
import { Context } from 'App';
import { ckOptions } from 'common/const';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: InViewRef, inView } = useInView();

  const [data, setData] = useState<Datum[]>([]);
  const [careerData, setCareerData] = useState<JData>();
  const [assets, setAssets] = useState<[string, string, string]>();
  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const context = useContext(Context);
  const ck = context?.ck || ckOptions[0].value;
  const seasonid = context?.seasonid || '3';

  const fetchAssetData = useCallback(async () => {
    try {
      const res = await fetchAssets(ck);
      if (res) {
        setAssets(res);
      }
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    }
  }, [ck]);

  const fetchCareerData = useCallback(async () => {
    try {
      const res = await fetchSeason(seasonid, ck);
      // 确保 res 不为空数组时才更新状态
      if (res) {
        setCareerData(res);
      }
    } catch (error) {
      console.error('Failed to fetch career data:', error);
    }
  }, [ck, seasonid]);

  const fetchAccessories = useCallback(
    async (currentPage: number) => {
      setLoading(currentPage === 1);
      try {
        const res = await fetchInfo(currentPage.toString(), ck);
        setData((prev) => (currentPage === 1 ? res : [...prev, ...res]));
        if (!res || res.length < 50) {
          setHasMore(false);
        }
      } finally {
        setLoading(false);
      }
    },
    [ck]
  );

  useEffect(() => {
    fetchCareerData();
    fetchAssetData();
    fetchAccessories(1);
  }, [fetchCareerData, fetchAccessories]);

  // 监听页码变化，加载新数据
  useEffect(() => {
    if (page > 1) {
      fetchAccessories(page);
    }
  }, [page, fetchAccessories]);

  useEffect(() => {
    if (inView) {
      setPage((prev) => prev + 1);
    }
  }, [inView]);

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

  return (
    <PullToRefreshify refreshing={refreshing} onRefresh={handleRefresh} renderText={renderText}>
      <div
        ref={containerRef}
        className="flex flex-col space-y-4 md:space-y-6 p-4 md:p-6 bg-gray-900 text-white min-h-screen overflow-y-auto"
      >
        {careerData && <CareerCard data={careerData} assets={assets} />}

        {data?.map((item, index) => <InfoCard key={item.dtEventTime + index} item={item} />)}

        {inView && hasMore && (
          <div className="flex justify-center pt-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div ref={InViewRef} style={{ height: '1px' }} />

        {!hasMore && data.length > 0 && (
          <div className="text-center text-gray-500 pb-4">没有更多数据了</div>
        )}
      </div>
    </PullToRefreshify>
  );
};

export { InfoView };

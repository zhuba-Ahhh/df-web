import { useRef, useContext, useState, useMemo, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { PullStatus, PullToRefreshify } from 'react-pull-to-refreshify';
import { InfoCard } from '../components/InfoCard';
import { CareerCard } from '../components/CareerCard';
import { useNavigate } from 'react-router-dom';
import type { TeammateArr } from '../types/info';
import { Context } from 'App';
import { useInfoData } from '../hooks/useInfoData';
import { InfoFilters } from '../components/InfoFilters';

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
  const context = useContext(Context);
  const [selectedMap, setSelectedMap] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    careerData,
    assets,
    loading,
    isFetchList,
    hasMore,
    setPage,
    seasonid,
    ck,
    changeCk,
    changeSeasonId,
    refresh,
  } = useInfoData();

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (selectedMap === 'all') return true;
      return item.MapId === selectedMap;
    });
  }, [data, selectedMap]);

  // 监听无限滚动
  useEffect(() => {
    if (inView && !isFetchList) {
      setPage((prev) => prev + 1);
    }
  }, [inView, isFetchList, setPage]);

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
    await refresh();
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
        <InfoFilters
          selectedMap={selectedMap}
          setSelectedMap={setSelectedMap}
          seasonid={seasonid}
          changeSeasonId={changeSeasonId}
          ck={ck}
          changeCk={changeCk}
        />

        {careerData && (
          <CareerCard data={careerData} assets={assets} key={careerData?.userData?.charac_name} />
        )}

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

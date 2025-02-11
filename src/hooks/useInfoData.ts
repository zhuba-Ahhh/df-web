/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback, useContext, useEffect } from 'react';
import { fetchInfo, fetchSeason, fetchAssets } from '../services/info';
import type { Datum, JData } from '../types/info';
import { Context } from 'App';
import { ckOptions } from 'common/const';

export const useInfoData = () => {
  const context = useContext(Context);
  const [data, setData] = useState<Datum[]>([]);
  const [careerData, setCareerData] = useState<JData>();
  const [assets, setAssets] = useState<[string, string, string]>();
  const [loading, setLoading] = useState(true);
  const [isFetchList, setIsFetchList] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [seasonid, setSeasonid] = useState(context?.seasonid || '3');
  const [ck, setCk] = useState(context?.ck || ckOptions[0].value);

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
      } catch (error) {
        console.error('Failed to fetch accessories:', error);
      } finally {
        setLoading(false);
        setIsFetchList(false);
      }
    },
    [ck]
  );

  useEffect(() => {
    const initializeData = async () => {
      try {
        await Promise.all([fetchCareerData(seasonid), fetchAccessories(1), fetchAssetData()]);
      } catch (error) {
        console.error('Failed to initialize data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

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
    [seasonid, fetchCareerData, fetchAccessories, fetchAssetData, context]
  );

  const changeSeasonId = useCallback(
    (newSeasonId: string) => {
      localStorage.setItem('seasonid', newSeasonId);
      context?.updateConfig?.({ seasonid: newSeasonId });
      setSeasonid(newSeasonId);
      fetchCareerData(newSeasonId);
    },
    [context, fetchCareerData]
  );

  const loadMore = useCallback(() => {
    if (page > 1) {
      fetchAccessories(page);
    }
  }, [page, fetchAccessories]);

  const refresh = useCallback(async () => {
    setPage(1);
    await Promise.all([fetchCareerData(), fetchAccessories(1), fetchAssetData()]);
  }, [fetchCareerData, fetchAccessories, fetchAssetData]);

  return {
    data,
    careerData,
    assets,
    loading,
    isFetchList,
    hasMore,
    page,
    setPage,
    seasonid,
    ck,
    fetchAssetData,
    fetchCareerData,
    fetchAccessories,
    changeCk,
    changeSeasonId,
    loadMore,
    refresh,
  };
};

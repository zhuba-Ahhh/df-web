import { http } from 'utils';
import type { Datum, JData } from '../types/info';

export const fetchInfo = async (page?: string, ck?: string) => {
  try {
    const response = await http.get<Datum[]>(
      `/info/getInfo?page=${page || 1}${ck ? '&ck=' + ck : ''}`
    );
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchSeason = async (seasonid?: string, ck?: string) => {
  try {
    const response = await http.get<JData>(
      `/info/getSeason?seasonid=${seasonid || 1}${ck ? '&ck=' + ck : ''}`
    );
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchAssets = async (ck?: string) => {
  try {
    const response = await http.get<[string, string, string]>(
      `/info/getAssets${ck ? '?ck=' + ck : ''}`
    );
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export interface ThreadDetailResponse {
  title: string;
  content: {
    text: string;
  };
  createdAt: string;
  editedAt: string;
}

export const fetchThreadDetail = async (ck?: string) => {
  try {
    const response = await http.get<ThreadDetailResponse>(
      `/info/getThreadDetail${ck ? '?ck=' + ck : ''}`
    );
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export interface AssetData {
  label: string;
  records: {
    timestamp: string;
    data: string[];
  }[];
}

export const getLocalAssets = async () => {
  try {
    const response = await http.get<AssetData[]>(`/info/getLocalAssets`);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

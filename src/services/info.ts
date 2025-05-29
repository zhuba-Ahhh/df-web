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
      `/info/getSeason?seasonid=${seasonid || 4}${ck ? '&ck=' + ck : ''}`
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

export interface CollectsRes {
  iRet: string;
  sMsg: string;
  itemidList: { [key: string]: string };
  typeArr: { [key: string]: number };
  count: string;
  nickName: string;
  headImg: string;
  milestoneHolds: string;
  sCollectionHolds: string;
  loginDayHolds: string;
  isGiftDay: boolean;
  isShowRankNum: boolean;
  rankNum: string;
}

export const getCollects = async () => {
  try {
    const response = await http.get<CollectsRes>(`/info/getCollects`);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export interface CookieItem {
  label: string;
  value: string;
}

// 新增：获取 Cookie 对象列表
export const fetchCookieList = async () => {
  try {
    const response = await http.get<CookieItem[]>(`/info/getCookieList`);
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// 新增：初始化 Cookie 列表（接收初始数据数组）
export const initCookieList = async (initialData: CookieItem[]) => {
  try {
    const response = await http.post<CookieItem[]>(`/info/initCookieList`, initialData);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 新增：新增 Cookie 对象（参数类型为 Omit<CookieItem, 'id'>，即不包含 id）
export const addCookieItem = async (item: CookieItem) => {
  try {
    const response = await http.post<CookieItem>(`/info/addCookie`, item);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 新增：修改 Cookie 对象（通过 label 匹配，更新 value）
export const updateCookieItem = async (label: string, value: string) => {
  try {
    const response = await http.post<CookieItem | null>(`/info/editCookie`, { label, value });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

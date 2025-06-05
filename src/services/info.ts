import { http } from 'utils';
import type {
  AssetData,
  CollectsRes,
  CookieItem,
  DailySecretResponse,
  Datum,
  IManufacturingDetails,
  IPersonResource,
  IYesterdayProfit,
  JData,
  ThreadDetailResponse,
} from '../types/info';

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

export const getLocalAssets = async () => {
  try {
    const response = await http.get<AssetData[]>(`/info/getLocalAssets`);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getCollects = async (ck: string) => {
  try {
    const response = await http.get<CollectsRes>(`/info/getCollects?ck=${ck}`);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

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
    // 构建查询参数
    const params = initialData
      .map((item) =>
        Object.entries(item)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&')
      )
      .join('&');
    const response = await http.get<CookieItem[]>(`/info/initCookieList?${params}`);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 新增：新增 Cookie 对象（参数类型为 Omit<CookieItem, 'id'>，即不包含 id）
export const addCookieItem = async (item: CookieItem) => {
  try {
    // 构建查询参数
    const params = Object.entries(item)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    const response = await http.get<CookieItem>(`/info/addCookie?${params}`);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 新增：删除 Cookie 对象（通过 label 匹配删除）
export const deleteItem = async (label: string) => {
  try {
    const response = await http.get<CookieItem | null>(
      `/info/deleteCookie?label=${encodeURIComponent(label)}`
    );
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 新增：修改 Cookie 对象（通过 label 匹配，更新 value）
export const updateCookieItem = async (label: string, value: string) => {
  try {
    const response = await http.get<CookieItem | null>(
      `/info/editCookie?label=${encodeURIComponent(label)}&value=${encodeURIComponent(value)}`
    );
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getYesterdayProfit = async (ck: string) => {
  try {
    const response = await http.get<IYesterdayProfit>(
      `/info/getYesterdayProfit${ck ? '?ck=' + ck : ''}`
    );
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * 获取每日情报（地图信息）。
 * @param ck 用户身份凭证 (cookie string)。
 * @returns 返回每日情报数据的Promise，若出错则返回null。
 */
export const getDailySecret = async (ck: string): Promise<DailySecretResponse> => {
  try {
    const response = await http.get<DailySecretResponse>(
      `/info/getDailySecret${ck ? '?ck=' + ck : ''}`
    );
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getPersonResource = async (
  ck: string,
  seasonid: string,
  isAllSeason?: boolean
): Promise<IPersonResource> => {
  try {
    const response = await http.get<IPersonResource>(
      `/info/getPersonResource${ck ? '?ck=' + ck : ''}&seasonid=${seasonid} &isAllSeason=${isAllSeason}`
    );
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getManufacturingDetails = async (ck: string): Promise<IManufacturingDetails> => {
  try {
    const response = await http.get<IManufacturingDetails>(
      `/info/getManufacturingDetails${ck ? '?ck=' + ck : ''}`
    );
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

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

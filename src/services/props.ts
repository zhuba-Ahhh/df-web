import { http } from '../utils';

export interface GetObjectDetailsResponse {
  list: List[];
}

export interface List {
  avgPrice: number;
  desc: string;
  grade: number;
  id: number;
  length: number;
  objectID: number;
  objectName: string;
  pic: string;
  prePic: string;
  primaryClass: string;
  propsDetail: PropsDetail;
  secondClass: string;
  secondClassCN: string;
  weight: string;
  width: number;
}

export interface PropsDetail {
  propsSource: string;
  type: string;
}

export const getObjectDetails = async (
  ck: string,
  objectIDs: string
): Promise<GetObjectDetailsResponse | null> => {
  try {
    const response = await http.post<GetObjectDetailsResponse>(`/props/getObjectDetails`, {
      ck,
      objectIDs,
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

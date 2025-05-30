import { http } from 'utils';

export interface WeekRecord {
  CarryOut_highprice_list: string;
  consume_Price: string;
  Gained_Price: string;
  GainedPrice_overmillion_num: string;
  Kill_ByCrocodile_num: string;
  Mandel_brick_num: string;
  Rank_Score: string;
  rise_Price: string;
  search_Birdsnest_num: string;
  TeammatePrice_overzero_num: string;
  total_ArmedForceId_num: string;
  total_Death_Count: string;
  total_exacuation_num: string;
  total_Kill_AI: string;
  total_Kill_Boss: string;
  total_Kill_Count: string;
  total_Kill_Player: string;
  total_mapid_num: string;
  Total_Mileage: string;
  total_Online_Time: string;
  Total_Price: string;
  total_Quest_num: string;
  total_Rescue_num: string;
  total_sol_num: string;
  use_Keycard_num: string;
}

export const fetchWeekRecord = async (ck?: string, statDate?: string) => {
  try {
    const response = await http.get<WeekRecord>('/week/getWeek', {
      params: { ck, statDate },
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

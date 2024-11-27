import { colors } from 'common/const';
import WeightGrid from 'components/WeightGrid';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { http } from 'utils/request';

export interface protectType {
  helmet?: ProtectItem[];
  armor?: ProtectItem[];
  bag?: ProtectItem[];
  chest?: ProtectItem[];
}

export interface AimSpeed {
  'percent '?: number;
  batteryValue: number;
  batteryColor: string;
  number?: number;
}

export interface ProtectItem {
  id: number;
  objectID: number;
  objectName: string;
  length: number;
  width: number;
  grade: number;
  weight: string;
  primaryClass: string;
  secondClass: string;
  secondClassCN: string;
  desc: string;
  pic: string;
  prePic: string;
  protectDetail: Record<string, string | Record<string, string>>;
}

export interface ProtectDetail {
  moveSpeed?: AimSpeed;
  capacity: number;
  aimSpeed?: AimSpeed;
}

const ProtectView = () => {
  const [propsData, setPropsData] = useState<protectType>({});
  const { type = '' } = useParams();

  const getAgents = useCallback(async () => {
    const res = await http.get<protectType>(`/protect/getProtect?type=${type}`);
    setPropsData(res);
  }, [type]);

  useEffect(() => {
    getAgents();
  }, [getAgents]);
  return (
    <div className="flex flex-col mb-5">
      {(type === 'helmet' || !type) && propsData.helmet && (
        <>
          <div className="divider px-8 mt-8">头盔</div>
          <div className="flex flex-wrap justify-center gap-8 mt-4 w-[calc(100vw-160px)]">
            {propsData.helmet?.map((item) => {
              return <CardRender key={item.id} data={item} />;
            })}
          </div>
        </>
      )}
      {(type === 'armor' || !type) && propsData.armor && (
        <>
          <div className="divider px-8 mt-8">护甲</div>
          <div className="flex flex-wrap justify-center gap-8 mt-4 w-[calc(100vw-160px)]">
            {propsData.armor?.map((item) => {
              return <CardRender key={item.id} data={item} />;
            })}
          </div>
        </>
      )}
      {(type === 'bag' || !type) && propsData.bag && (
        <>
          <div className="divider px-8 mt-8">背包</div>
          <div className="flex flex-wrap justify-center gap-8 mt-4 w-[calc(100vw-160px)]">
            {propsData.bag?.map((item) => {
              return <CardRender key={item.id} data={item} />;
            })}
          </div>
        </>
      )}
      {(type === 'chest' || !type) && propsData.chest && (
        <>
          <div className="divider px-8 mt-8">胸挂</div>
          <div className="flex flex-wrap justify-center gap-8 mt-4 w-[calc(100vw-160px)]">
            {propsData.chest?.map((item) => {
              return <CardRender key={item.id} data={item} />;
            })}
          </div>
        </>
      )}
    </div>
  );
};

const CardRender = ({ data }: { data: ProtectItem }) => {
  return (
    <div className="card bg-base-100 w-80 shadow-xl p-2 cursor-pointer">
      <figure style={{ backgroundColor: colors[data.grade - 1] }} className="p-4">
        <img src={data.pic} alt={data.objectName} className="h-60 object-contain" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {data.objectName}
          {data.secondClass !== 'mandel' && (
            <div className="badge" style={{ backgroundColor: colors[data.grade - 1] }}>
              {data.secondClassCN}
            </div>
          )}
        </h2>
        <p>{data.desc}</p>
        <div className="card-actions justify-between">
          <div>
            <div>{data.weight}kg</div>
            {/* <div>{`${data.length} X ${data.width}  ${data.length * data.width} 格`}</div> */}
            <WeightGrid width={Number(data.width)} length={Number(data.length)} />
          </div>
          <div className="w-40">
            {data?.protectDetail?.capacity && typeof data?.protectDetail?.capacity !== 'object' && (
              <div className="badge badge-outline collapse mb-1">
                容量： {data.protectDetail.capacity} 格
              </div>
            )}
            {data?.protectDetail?.durability &&
              typeof data?.protectDetail?.durability !== 'object' && (
                <div className="badge badge-outline collapse mb-1">
                  耐久： {data?.protectDetail?.durability}
                </div>
              )}
            {data?.protectDetail?.protectArea &&
              typeof data?.protectDetail?.protectArea !== 'object' && (
                <div className="badge badge-outline collapse mb-1">
                  保护区域： {data?.protectDetail?.protectArea}
                </div>
              )}
            {data?.protectDetail?.moveSpeed &&
              typeof data?.protectDetail?.moveSpeed !== 'string' && (
                <div className="badge badge-outline collapse mb-1">
                  移动速度： {data?.protectDetail?.moveSpeed?.percent}%
                </div>
              )}
            {data?.protectDetail?.aimSpeed && typeof data?.protectDetail?.aimSpeed !== 'string' && (
              <div className="badge badge-outline collapse mb-1">
                武器操作： {data?.protectDetail?.aimSpeed?.percent}%
              </div>
            )}
            {data?.protectDetail?.faceMask && typeof data?.protectDetail?.faceMask !== 'string' && (
              <div className="badge badge-outline collapse mb-1">
                影响： {data?.protectDetail?.faceMask?.value}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProtectView };

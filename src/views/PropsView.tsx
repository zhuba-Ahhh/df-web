import { colors } from 'common/const';
import WeightGrid from 'components/WeightGrid';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { http } from 'utils/request';

interface propsType {
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
  propsDetail: PropsDetail;
}

interface PropsDetail {
  type: string; // collection
  propsSource: string;

  availableCount: number; // consume
  activeTime: string;

  hearEnhance: string;
  bearEnhance: string;
  bodyCapacity: string;

  repairPoints: number;
  repairArea: string;
  repairEfficiency: string;
  replyEffect: string;

  avaRatio: string; // mandel
  core: Array<{ skinID: number; ratio: string; pic: string }>;
  other: Array<{ skinID: number; ratio: string; pic: string }>;

  useMap: string; // key
  usePlace: string;
  durability: number;
}

interface propsDataType {
  key?: propsType[];
  mandel?: propsType[];
  consume?: propsType[];
  collection?: propsType[];
}

const PropsView = () => {
  const [propsData, setPropsData] = useState<propsDataType>({});
  const { type = 'collection' } = useParams();

  const getAgents = useCallback(async () => {
    const res = await http.get<propsDataType>(`/props/getProps?type=${type}`);
    setPropsData(res);
  }, [type]);

  useEffect(() => {
    getAgents();
  }, [getAgents]);
  return (
    <div className="flex flex-col mb-5">
      {(type === 'collection' || !type) && propsData.collection && (
        <>
          <div className="divider px-8 mt-8">收集品</div>
          <div className="flex flex-wrap justify-center gap-8 mt-4 w-[calc(100vw-160px)]">
            {propsData.collection?.map((item) => {
              return <CardRender key={item.id} data={item} />;
            })}
          </div>
        </>
      )}
      {(type === 'consume' || !type) && propsData.consume && (
        <>
          <div className="divider px-8 mt-8">消耗品</div>
          <div className="flex flex-wrap justify-center gap-8 mt-4 w-[calc(100vw-160px)]">
            {propsData.consume?.map((item) => {
              return <CardRender key={item.id} data={item} />;
            })}
          </div>
        </>
      )}
      {(type === 'key' || !type) && propsData.key && (
        <>
          <div className="divider px-8 mt-8">钥匙</div>
          <div className="flex flex-wrap justify-center gap-8 mt-4 w-[calc(100vw-160px)]">
            {propsData.key?.map((item) => {
              return <CardRender key={item.id} data={item} />;
            })}
          </div>
        </>
      )}
      {(type === 'mandel' || !type) && propsData.mandel && (
        <>
          <div className="divider px-8 mt-8">曼德尔砖</div>
          <div className="flex flex-wrap justify-center gap-8 mt-4 w-[calc(100vw-160px)]">
            {propsData &&
              propsData.mandel?.map((item) => {
                return <CardRender key={item.id} data={item} />;
              })}
          </div>
        </>
      )}
    </div>
  );
};

const CardRender = ({ data }: { data: propsType }) => {
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
          <div className="w-40 h-full">
            {data.propsDetail.type && (
              <div className="badge badge-outline collapse mb-1">{data.propsDetail.type}</div>
            )}
            {data?.propsDetail?.propsSource &&
              data.propsDetail.propsSource.split(',').map((item) => (
                <div key={item} className="badge badge-outline collapse mb-1">
                  {item}
                </div>
              ))}
            {data.propsDetail.useMap && (
              <div className="badge badge-outline collapse mb-1">{data.propsDetail.usePlace}</div>
            )}
            {data.propsDetail.usePlace && (
              <div className="badge badge-outline collapse mb-1">{data.propsDetail.usePlace}</div>
            )}
            {data.propsDetail.durability && (
              <div className="badge badge-outline collapse mb-1">
                {data.propsDetail.durability}次
              </div>
            )}

            {data.propsDetail.replyEffect && (
              <div className="badge badge-outline collapse mb-1">
                效果：{data.propsDetail.replyEffect}
              </div>
            )}
            {data.propsDetail.hearEnhance && (
              <div className="badge badge-outline collapse mb-1">
                效果：{data.propsDetail.hearEnhance}
              </div>
            )}
            {data.propsDetail.bearEnhance && (
              <div className="badge badge-outline collapse mb-1">
                效果：{data.propsDetail.bearEnhance}
              </div>
            )}
            {data.propsDetail.bodyCapacity && (
              <div className="badge badge-outline collapse mb-1">
                效果：{data.propsDetail.bodyCapacity}
              </div>
            )}
            {data.propsDetail.repairPoints && (
              <div className="badge badge-outline collapse mb-1">
                修理点：{data.propsDetail.repairPoints}
              </div>
            )}
            {data.propsDetail.availableCount && (
              <div className="badge badge-outline collapse mb-1">
                可用次数：{data.propsDetail.availableCount}
              </div>
            )}
            {data.propsDetail.activeTime && (
              <div className="badge badge-outline collapse mb-1">
                持续时间：{data.propsDetail.activeTime}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { PropsView };

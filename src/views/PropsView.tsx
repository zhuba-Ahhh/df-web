import { colors } from 'common/const';
import WeightGrid from 'components/WeightGrid';
import { useEffect, useState } from 'react';
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
  type: string;
  propsSource: string;
}

interface propsDataType {
  key?: propsType[];
  mandel?: propsType[];
  consume?: propsType[];
  collection?: propsType[];
}

const PropsView = () => {
  const [propsData, setPropsData] = useState<propsDataType>({});

  const getAgents = async () => {
    const res = await http.get<propsDataType>(`/props/getProps`);
    setPropsData(res);
  };

  useEffect(() => {
    getAgents();
  }, []);
  return (
    <div className="flex flex-col">
      <h2 className="card-title mx-20 mt-2">收集品</h2>
      <div className="flex flex-wrap justify-center gap-8 mt-4 w-[calc(100vw-160px)]">
        {propsData &&
          propsData.collection?.map((item) => {
            return <CardRender key={item.id} data={item} />;
          })}
      </div>
      <h2 className="card-title mx-20 mt-2">消耗品</h2>
      <div className="flex flex-wrap justify-center gap-8 mt-4 w-[calc(100vw-160px)]">
        {propsData &&
          propsData.consume?.map((item) => {
            return <CardRender key={item.id} data={item} />;
          })}
      </div>
      <h2 className="card-title mx-20 mt-2">钥匙</h2>
      <div className="flex flex-wrap justify-center gap-8 mt-4 w-[calc(100vw-160px)]">
        {propsData &&
          propsData.key?.map((item) => {
            return <CardRender key={item.id} data={item} />;
          })}
      </div>
      <h2 className="card-title mx-20 mt-2">曼德尔砖</h2>
      <div className="flex flex-wrap justify-center gap-8 mt-4 w-[calc(100vw-160px)]">
        {propsData &&
          propsData.mandel?.map((item) => {
            return <CardRender key={item.id} data={item} />;
          })}
      </div>
    </div>
  );
};

const CardRender = ({ data }: { data: propsType }) => {
  return (
    <div className="card bg-base-100 w-80 shadow-xl p-2 cursor-pointer">
      <figure style={{ backgroundColor: colors[data.grade - 1] }} className="p-4">
        <img src={data.pic} alt={data.objectName} className="h-60 object-cover" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {data.objectName}
          <div className="badge" style={{ backgroundColor: colors[data.grade - 1] }}>
            {data.secondClassCN}
          </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export { PropsView };

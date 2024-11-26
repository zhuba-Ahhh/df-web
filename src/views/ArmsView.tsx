import { colors } from 'common/const';
import WeightGrid from 'components/WeightGrid';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { JSX } from 'react/jsx-runtime';
import { http } from 'utils/request';

type AmmoDetail = {
  penetrationLevel: number;
  harmRatio: number;
  armorHarmLevel: '低' | '中' | '高';
};

type GunDetail = {
  meatHarm: number;
  shootDistance: number;
  recoil: number;
  control: number;
  stable: number;
  hipShot: number;
  armorHarm: number;
  fireSpeed: number;
  capacity: number;
  fireMode: string;
  muzzleVelocity: number;
  soundDistance: number;
  caliber: string;
  ammo: Array<{ objectID: number }>;
  accessory: Array<{ slotID: string }>;
  allAccessory: Array<{ slotID: string }>;
};

type RelateMapItem = {
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
  pic: string;
  prePic: string;
  ammoDetail: AmmoDetail;
};

type GunItem = {
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
  gunDetail: GunDetail;
};

type ListDataType = {
  list?: Array<GunItem>;
  relateMap?: { [key: string]: RelateMapItem };
};

const ArmsView = () => {
  const [armsData, setArmsData] = useState<ListDataType>({});
  const { type = 'all' } = useParams();

  const getAgents = useCallback(async () => {
    const res = await http.get<ListDataType>(`/arms/getArms?type=${type}`);
    setArmsData(res);
  }, [type]);

  useEffect(() => {
    getAgents();
  }, [getAgents]);

  const ListRender = useCallback(() => {
    if (!armsData?.list || armsData?.list?.length < 1) return null;
    const res: JSX.Element[] = [
      <div className="divider px-8 mt-8" key={armsData.list[0].secondClassCN}>
        {armsData.list[0].secondClassCN}
      </div>,
    ];
    let temp: JSX.Element[] = [];
    armsData?.list.forEach((item, index, arr) => {
      if (
        (index < arr.length - 1 && item.secondClass !== arr[index + 1].secondClass) ||
        (index === arr.length - 2 && item.secondClass === arr[index + 1].secondClass)
      ) {
        temp.push(<CardRender key={item.id} data={item} />);
        res.push(
          <div
            className="flex flex-wrap justify-center gap-8 mt-4 w-[calc(100vw-160px)]"
            key={index}
          >
            {temp.map((item) => item)}
          </div>
        );
        item.secondClass !== arr[index + 1].secondClass &&
          res.push(
            <div className="divider px-8 mt-8" key={arr[index + 1].secondClassCN}>
              {arr[index + 1].secondClassCN}
            </div>
          );
        temp = [];
      } else {
        temp.push(<CardRender key={item.id} data={item} />);
      }
    });

    return res;
  }, [armsData.list]);
  return <div className="flex flex-col mb-5">{armsData?.list && <ListRender />}</div>;
};

const CardRender = ({ data }: { data: GunItem }) => {
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
            {data?.gunDetail?.capacity && (
              <div className="badge badge-outline collapse mb-1">
                装弹量： {data.gunDetail.capacity} 发
              </div>
            )}
            {data?.gunDetail?.caliber && (
              <div className="badge badge-outline collapse mb-1">
                口径： {data.gunDetail.caliber}
              </div>
            )}
            {data?.gunDetail?.fireMode && (
              <div className="badge badge-outline collapse mb-1">{data.gunDetail.fireMode}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ArmsView };

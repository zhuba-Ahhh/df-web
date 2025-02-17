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
    if (!armsData?.list?.length) return null;

    return armsData.list.reduce((acc: JSX.Element[], item, index, arr) => {
      const isNewSection = index === 0 || item.secondClass !== arr[index - 1].secondClass;
      const isLastItem = index === arr.length - 1;

      if (isNewSection) {
        acc.push(
          <div className="divider px-4 md:px-8 mt-6 md:mt-8" key={`divider-${item.secondClassCN}`}>
            {item.secondClassCN}
          </div>
        );
      }

      if (isLastItem || arr[index + 1]?.secondClass !== item.secondClass) {
        acc.push(
          <div
            className="flex flex-wrap justify-center gap-4 mt-4 w-full md:w-[calc(100vw-160px)] px-4 md:px-0"
            key={`section-${index}`}
          >
            {arr
              .slice(
                isNewSection ? index : arr.findIndex((x) => x.secondClass === item.secondClass),
                index + 1
              )
              .map((gun) => (
                <CardRender key={gun.id} data={gun} />
              ))}
          </div>
        );
      }

      return acc;
    }, []);
  }, [armsData.list]);

  return <div className="flex flex-col mb-5">{armsData?.list && <ListRender />}</div>;
};

const GunBadge = ({ gunDetail }: { gunDetail: GunDetail }) => (
  <div className="w-full md:w-40 flex flex-wrap gap-2 md:block">
    {[
      { value: gunDetail.capacity, label: `装弹量： ${gunDetail.capacity} 发` },
      { value: gunDetail.caliber, label: `口径： ${gunDetail.caliber}` },
      { value: gunDetail.fireMode, label: gunDetail.fireMode },
    ].map(
      ({ value, label }) =>
        value && (
          <div key={label} className="badge badge-outline collapse md:mb-1">
            {label}
          </div>
        )
    )}
  </div>
);

const CardRender = ({ data }: { data: GunItem }) => (
  <div className="card bg-base-100 w-full md:w-80 shadow-xl p-2 cursor-pointer">
    <figure style={{ backgroundColor: colors[data.grade - 1] }} className="p-4">
      <img
        src={data.pic}
        alt={data.objectName}
        className="h-40 md:h-60 object-contain"
        loading="lazy"
      />
    </figure>
    <div className="card-body p-4 md:p-6">
      <h2 className="card-title">
        {data.objectName}
        <div className="badge" style={{ backgroundColor: colors[data.grade - 1] }}>
          {data.secondClassCN}
        </div>
      </h2>
      <p>{data.desc}</p>
      <div className="card-actions flex-col md:flex-row justify-between gap-4 md:gap-2">
        <div>
          <div>{data.weight}kg</div>
          <WeightGrid width={Number(data.width)} length={Number(data.length)} />
        </div>
        <GunBadge gunDetail={data.gunDetail} />
      </div>
    </div>
  </div>
);

export { ArmsView };

import { colors } from 'common/const';
import WeightGrid from 'components/WeightGrid';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { http } from 'utils/request';

type AccDetail = {
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

type AccItem = {
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
  accDetail: AccDetail;
};

type ListDataType = {
  accForeGrip?: AccItem[];
  accFunctional?: AccItem[];
};

const AccView = () => {
  const [accData, setAccData] = useState<ListDataType>({});
  const { type } = useParams();

  const fetchAccessories = useCallback(async () => {
    const res = await http.get<ListDataType>(`/accessories/getAccessories?type=${type || 'all'}`);
    setAccData(res);
  }, [type]);

  useEffect(() => {
    fetchAccessories();
  }, [fetchAccessories]);

  return (
    <div className="flex flex-col mb-5">
      <AccessorySection
        show={type === 'accForeGrip' || !type}
        items={accData.accForeGrip}
        title="前握把"
      />
      <AccessorySection
        show={type === 'accFunctional' || !type}
        items={accData.accFunctional}
        title="功能性配件"
      />
    </div>
  );
};

const AccessorySection = ({
  show,
  items,
  title,
}: {
  show: boolean;
  items?: AccItem[];
  title: string;
}) => {
  if (!show || !items) return null;

  return (
    <>
      <div className="divider px-4 mt-6 text-base">{title}</div>
      <div className="flex flex-col items-center gap-4 mt-4 px-4 md:flex-wrap md:flex-row md:justify-center md:gap-8 md:w-[calc(100vw-160px)]">
        {items.map((item) => (
          <AccessoryCard key={item.id} data={item} />
        ))}
      </div>
    </>
  );
};

const AccessoryCard = ({ data }: { data: AccItem }) => {
  const bgColor = { backgroundColor: colors[data.grade - 1] };

  return (
    <div className="card bg-base-100 w-full md:w-80 shadow-xl p-2 cursor-pointer active:scale-95 transition-transform">
      <figure style={bgColor} className="p-3 md:p-4">
        <img
          src={data.pic}
          alt={data.objectName}
          className="h-48 md:h-60 object-contain"
          loading="lazy"
        />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg md:text-xl">
          {data.objectName}
          {data.secondClass !== 'mandel' && (
            <div className="badge text-sm" style={bgColor}>
              {data.secondClassCN}
            </div>
          )}
        </h2>
        <p className="text-sm md:text-base">{data.desc}</p>
        <div className="card-actions justify-between items-center mt-2">
          <div>
            <div className="text-sm md:text-base">{data.weight}kg</div>
            <WeightGrid width={Number(data.width)} length={Number(data.length)} />
          </div>
          <div className="w-24 md:w-40" />
        </div>
      </div>
    </div>
  );
};

export { AccView };

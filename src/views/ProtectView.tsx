import { colors } from 'common/const';
import WeightGrid from 'components/WeightGrid';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { http } from 'utils/request';

export interface protectType {
  helmet?: ProtectItem[];
  armor?: ProtectItem[];
  bag?: ProtectItem[];
  chest?: ProtectItem[];
}

interface faceType {
  percent?: number;
  number?: number;
  value?: number;
}

export interface ProtectDetail {
  capacity?: string;
  durability?: string;
  protectArea?: string;
  moveSpeed?: faceType;
  aimSpeed?: faceType;
  faceMask?: faceType;
}

export interface ProtectItem {
  id: number;
  objectID: number;
  objectName: string;
  length: number;
  width: number;
  grade: number;
  weight: string;
  secondClass: string;
  secondClassCN: string;
  desc: string;
  pic: string;
  protectDetail: ProtectDetail;
}

const ProtectView = () => {
  const [propsData, setPropsData] = useState<protectType>({});
  const { type = '' } = useParams();

  useEffect(() => {
    const getAgents = async () => {
      const res = await http.get<protectType>(`/protect/getProtect?type=${type}`);
      setPropsData(res);
    };
    getAgents();
  }, [type]);

  const renderSection = (sectionType: keyof protectType, title: string) => {
    const items = propsData[sectionType];
    if ((type === sectionType || !type) && items) {
      return (
        <>
          <div className="divider px-4 sm:px-8 mt-4 sm:mt-8">{title}</div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-2 sm:mt-4 w-full sm:w-[calc(100vw-160px)] px-2 sm:px-0">
            {items.map((item) => (
              <CardRender key={item.id + title} data={item} />
            ))}
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col mb-5">
      {renderSection('helmet', '头盔')}
      {renderSection('armor', '护甲')}
      {renderSection('bag', '背包')}
      {renderSection('chest', '胸挂')}
    </div>
  );
};

const CardRender = ({ data }: { data: ProtectItem }) => {
  const renderDetailBadge = (key: keyof ProtectDetail, label: string) => {
    const detail = data.protectDetail[key];
    if (!detail) return null;

    let value = '';
    if (typeof detail === 'object') {
      if ('percent' in detail) {
        value = `${detail.percent || detail.number}%`;
      } else if ('number' in detail) {
        value = `${detail.number}%`;
      } else if ('value' in detail) {
        value = `${detail.value}`;
      }
    } else {
      value = `${detail} 格`;
    }

    return (
      <div className="badge badge-outline collapse mb-1">
        {label}： {value}
      </div>
    );
  };

  return (
    <div className="card bg-base-100 w-full sm:w-80 shadow-xl p-2 cursor-pointer">
      <figure style={{ backgroundColor: colors[data.grade - 1] }} className="p-2 sm:p-4">
        <img src={data.pic} alt={data.objectName} className="h-48 sm:h-60 object-contain" />
      </figure>
      <div className="card-body p-4 sm:p-6">
        <h2 className="card-title text-base sm:text-lg">
          {data.objectName}
          {data.secondClass !== 'mandel' && (
            <div className="badge text-sm" style={{ backgroundColor: colors[data.grade - 1] }}>
              {data.secondClassCN}
            </div>
          )}
        </h2>
        <p className="text-sm sm:text-base">{data.desc}</p>
        <div className="card-actions flex-col sm:flex-row justify-between gap-4 sm:gap-0">
          <div>
            <div className="text-sm sm:text-base">{data.weight}kg</div>
            <WeightGrid width={Number(data.width)} length={Number(data.length)} />
          </div>
          <div className="w-full sm:w-40 flex flex-wrap gap-1">
            {renderDetailBadge('capacity', '容量')}
            {renderDetailBadge('durability', '耐久')}
            {renderDetailBadge('protectArea', '保护区域')}
            {renderDetailBadge('moveSpeed', '移动速度')}
            {renderDetailBadge('aimSpeed', '武器操作')}
            {renderDetailBadge('faceMask', '影响')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtectView;

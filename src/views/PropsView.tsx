import { colors } from 'common/const';
import WeightGrid from 'components/WeightGrid';
import { useEffect, useState, useCallback, Fragment } from 'react';
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

// 添加常量定义
const PROP_TYPES = {
  collection: '收集品',
  consume: '消耗品',
  key: '钥匙',
  mandel: '曼德尔砖',
} as const;

interface BadgeConfig {
  key: keyof PropsDetail;
  prefix?: string;
  format?: (value: number) => string;
}

const BADGE_CONFIG: BadgeConfig[] = [
  { key: 'type' },
  { key: 'useMap' },
  { key: 'usePlace' },
  { key: 'durability', format: (value) => `${value}次` },
  { key: 'replyEffect', prefix: '效果' },
  { key: 'hearEnhance', prefix: '效果' },
  { key: 'bearEnhance', prefix: '效果' },
  { key: 'bodyCapacity', prefix: '效果' },
  { key: 'repairPoints', prefix: '修理点' },
  { key: 'availableCount', prefix: '可用次数' },
  { key: 'activeTime', prefix: '持续时间' },
];

const Badge = ({ content, prefix }: { content: string; prefix?: string }) => (
  <div className="badge badge-outline collapse mb-1">
    {prefix ? `${prefix}：${content}` : content}
  </div>
);

const CardRender = ({ data }: { data: propsType }) => {
  const {
    propsDetail,
    grade,
    objectName,
    secondClass,
    secondClassCN,
    desc,
    weight,
    width,
    length,
    pic,
  } = data;

  return (
    <div className="card bg-base-100 w-80 shadow-xl p-2 cursor-pointer">
      <figure style={{ backgroundColor: colors[grade - 1] }} className="p-4">
        <img src={pic} alt={objectName} className="h-60 object-contain" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {objectName}
          {secondClass !== 'mandel' && (
            <div className="badge" style={{ backgroundColor: colors[grade - 1] }}>
              {secondClassCN}
            </div>
          )}
        </h2>
        <p>{desc}</p>
        <div className="card-actions justify-between">
          <div>
            <div>{weight}kg</div>
            <WeightGrid width={Number(width)} length={Number(length)} />
          </div>
          <div className="w-40 h-full">
            {BADGE_CONFIG.map(({ key, prefix, format }, index) => {
              const value = propsDetail[key];
              if (!value) return null;
              return (
                <div key={key + index}>
                  <Badge
                    content={format && typeof value === 'number' ? format(value) : String(value)}
                    prefix={prefix}
                  />
                </div>
              );
            })}
            {propsDetail?.propsSource?.split(',').map((item, index) => (
              <div key={JSON.stringify(item) + index}>
                <Badge content={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const PropsView = () => {
  const [propsData, setPropsData] = useState<propsDataType>({});
  const { type } = useParams();

  const fetchProps = useCallback(async () => {
    const res = await http.get<propsDataType>(`/props/getProps?type=${type || 'all'}`);
    setPropsData(res);
  }, [type]);

  useEffect(() => {
    fetchProps();
  }, [fetchProps]);

  const renderPropSection = useCallback(
    (propType: keyof typeof PROP_TYPES) => {
      const items = propsData[propType];
      if ((!type || type === propType) && items?.length) {
        return (
          <Fragment key={propType}>
            <div className="divider px-8 mt-8">{PROP_TYPES[propType]}</div>
            <div className="flex flex-wrap justify-center gap-8 mt-4 w-[calc(100vw-160px)]">
              {items.map((item, index) => (
                <CardRender key={JSON.stringify(item.id) + index} data={item} />
              ))}
            </div>
          </Fragment>
        );
      }
      return null;
    },
    [propsData, type]
  );

  return (
    <div className="flex flex-col mb-5">
      {Object.keys(PROP_TYPES).map((key) => renderPropSection(key as keyof typeof PROP_TYPES))}
    </div>
  );
};

export { PropsView };

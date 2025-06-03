import { colors } from 'common/const';
import React from 'react';
import { CollectionItemDetails } from 'views/WeekReportView'; // 从 WeekReportView 导入类型

// 定义 context.collection 的类型结构 (如果 WeekReportView 中的 CollectionData 也是这个，可以考虑共享)
interface CollectionData {
  [itemid: string]: CollectionItemDetails;
}

// 定义处理后用于展示的收藏品数据结构
interface ProcessedCollectible {
  itemid: number;
  name: string;
  singlePrice: number;
  img?: string;
  grade?: string;
}

// 辅助函数：解析字符串为对象数组 (从 WeekReportView 移过来)
const stringToArray = (param: string) => {
  if (typeof param !== 'string') return null;
  const arr = param.split('#');
  const reg = /[\u4e00-\u9fa5]+/g;
  return arr
    .map((v) => {
      const item = v.replace(reg, (v) => `"${v}"`);
      try {
        return item ? JSON.parse(item.replace(/'/g, '"')) : null;
      } catch (e) {
        console.warn('Failed to parse item string:', item, e);
        return null;
      }
    })
    .filter(Boolean); // 移除解析失败的 null 项
};

// 辅助函数：获取最有价值的收藏品 (从 WeekReportView 移过来并调整)
const getTopCollectibles = (
  carryOutListStr: string | undefined,
  collectionData: CollectionData | undefined
): ProcessedCollectible[] => {
  if (!carryOutListStr || !collectionData) {
    return [];
  }

  const collectibles: ProcessedCollectible[] = [];
  const rawItemEntries = stringToArray(carryOutListStr) || [];

  for (const item of rawItemEntries) {
    if (!item) continue;
    try {
      if (item.auctontype === '收集品') {
        const details = collectionData[item.itemid.toString()];
        if (details && details.name) {
          const singlePrice = item.inum > 1 ? item.iPrice / item.inum : item.iPrice;
          collectibles.push({
            itemid: item.itemid,
            name: details.name,
            singlePrice: singlePrice,
            img: details.img || `${item.itemid}.png`,
            grade: details.grade,
          });
        }
      }
    } catch (error) {
      console.warn('Error processing collectible item:', item, error);
    }
  }

  return collectibles.sort((a, b) => b.singlePrice - a.singlePrice).slice(0, 10);
};

interface TopCollectiblesViewProps {
  carryOutListStr: string | undefined;
  collectionData: CollectionData | undefined;
}

const TopCollectiblesView: React.FC<TopCollectiblesViewProps> = ({
  carryOutListStr,
  collectionData,
}) => {
  const topCollectibles = getTopCollectibles(carryOutListStr, collectionData);

  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-300">本周带出最有价值藏品</span>
      {topCollectibles.length > 0 ? (
        <div className="flex mt-1 space-x-2 items-start overflow-x-auto pr-1 hide-scrollbar">
          {topCollectibles.map((collectible) => (
            <div
              key={collectible.itemid}
              className={`flex flex-col items-center p-1.5 rounded bg-gray-700/50 border border-gray-600/50 w-24 text-center earnings-item2`}
              style={{ backgroundColor: colors[Number(collectible.grade || 0) - 1] }}
            >
              <img
                src={`//game.gtimg.cn/images/dfm/cp/weekly20241129/collection/${collectible.img}`}
                alt={collectible.name}
                className="w-12 h-12 object-contain mb-0.5"
                onError={(e) => {
                  e.currentTarget.src = '//via.placeholder.com/48?text=Error'; // Fallback image
                }}
              />
              <span className="text-xs text-gray-200 leading-tight block truncate w-full earnings-name">
                <em>{collectible.name}</em>
              </span>
              <span className="text-xs text-yellow-400 font-semibold">
                {collectible.singlePrice.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-base font-medium text-gray-500 mt-1">无</div>
      )}
    </div>
  );
};

export default TopCollectiblesView;

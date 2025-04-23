import { useEffect, useState } from 'react';
import { CollectsRes, getCollects } from '../services/info';
import { useAppContext } from 'contexts/AppProvider';

const CollectsVew = () => {
  const [data, setData] = useState<CollectsRes | null>(null);
  const [loading, setLoading] = useState(true);
  const context = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCollects();
        setData(response);
      } catch (error) {
        console.error('Failed to fetch thread detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-400">
        加载中...
      </div>
    );
  }

  if (!data || (!loading && !context.collects?.length)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-400">
        未找到数据
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {context.collects?.map((category) => (
          <div key={category.title} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {category?.info?.map((item) => {
                const count = data?.itemidList[`150${item.id.toString().padStart(8, '0')}`] || '0';
                return (
                  <div
                    key={item.id}
                    className="bg-gray-800/80 backdrop-blur p-5 rounded-xl border border-gray-700 relative flex flex-col h-full"
                  >
                    {parseInt(count) > 0 && (
                      <div className="absolute top-3 right-3 bg-blue-500 text-white px-2.5 py-1 rounded-full text-sm font-medium">
                        {count}
                      </div>
                    )}
                    <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-lg">
                      <img
                        src={`https://game.gtimg.cn/images/dfm/cp/a20241222dhsj/${item.img}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-3 line-clamp-1">{item.name}</h3>
                    <div className="text-sm text-gray-400 space-y-2">
                      <p>来源：{item.source.join('、')}</p>
                      <p>用途：{item.purpose.join('、')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { CollectsVew };

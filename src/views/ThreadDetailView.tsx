import { useEffect, useState } from 'react';
import { fetchThreadDetail } from '../services/info';
import { useAppContext } from 'contexts/AppProvider';
import { ThreadDetailResponse } from 'types/info';

const ThreadDetailView = () => {
  const [data, setData] = useState<ThreadDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { ckOptions } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchThreadDetail(ckOptions[0]?.value);
        setData(response);
      } catch (error) {
        console.error('Failed to fetch thread detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ckOptions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-400">
        加载中...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-gray-400">
        未找到数据
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/80 backdrop-blur p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold mb-2">{data.title}</h2>
          <div className="mb-2 text-sm text-gray-400">
            {data.editedAt && <p>更新时间：{new Date(data.editedAt).toLocaleString()}</p>}
          </div>
          <div
            className="prose prose-invert max-w-none mb-2"
            dangerouslySetInnerHTML={{ __html: data.content.text }}
          />
        </div>
      </div>
    </div>
  );
};

export default ThreadDetailView;

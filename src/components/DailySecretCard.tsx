import { useEffect, useState } from 'react';
import { getDailySecret } from '../services/info'; // 确保路径正确
import { DailySecretResponse } from 'types/info';

interface DailySecretCardProps {
  ck: string;
}

export const DailySecretCard = ({ ck }: DailySecretCardProps) => {
  const [secretData, setSecretData] = useState<DailySecretResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ck) {
      setLoading(false);
      setError('未提供ck参数');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDailySecret(ck);
        if (data && data.length > 0) {
          setSecretData(data);
        } else {
          setSecretData(null);
        }
      } catch (err) {
        setSecretData(null);
        setError('获取今日密码数据时发生错误。');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ck]);

  if (loading || error || !secretData || secretData.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur p-2 md:p-3 rounded-xl shadow-lg border border-gray-700 text-white">
      <div className="flex items-center">
        <div className="mr-2">
          <h4 className="text-base font-bold leading-tight">今日</h4>
          <h4 className="text-base font-bold leading-tight">密码</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 flex-grow">
          {secretData.map((item) => (
            <div key={item.mapName} className="bg-gray-700/50 p-1 rounded-lg text-center">
              <span className="text-sm text-gray-300 mr-1">{item.mapName}</span>
              <span className="text-sm font-extrabold text-white">{item.key}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAppContext } from 'contexts/AppProvider';
import { seasonOptions } from 'common/const';

const SettingView = () => {
  const context = useAppContext();
  const { ckOptions } = context;
  const [ck, setCk] = useState(context?.ck || ckOptions[0].value);
  const [seasonid, setSeasonid] = useState(context?.seasonid || '3');
  const [customCk, setCustomCk] = useState('');

  const handleSubmit = useCallback(async () => {
    try {
      ck && localStorage.setItem('ck', ck === 'custom' ? customCk : ck);
      seasonid && localStorage.setItem('seasonid', seasonid);
      ck && seasonid && context?.updateConfig?.({ ck, seasonid });
    } catch (error) {
      console.error('保存配置失败:', error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ck, customCk, seasonid]);

  const isCustom = useMemo(() => ck === 'custom', [ck]);

  useEffect(() => {
    !isCustom && handleSubmit();
  }, [ck, handleSubmit, isCustom, seasonid]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">设置</h1>
      <div className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="ck" className="block text-sm font-medium">
            CK
          </label>
          <select
            id="ck"
            value={ck}
            onChange={(e) => setCk(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {ckOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {isCustom && (
            <input
              type="text"
              value={customCk}
              onChange={(e) => setCustomCk(e.target.value)}
              placeholder="请输入自定义CK"
              className="mt-2 w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="seasonid" className="block text-sm font-medium">
            Season ID
          </label>
          <select
            id="seasonid"
            value={seasonid}
            onChange={(e) => setSeasonid(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            {seasonOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {isCustom && (
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            保存设置
          </button>
        )}
      </div>
    </div>
  );
};

export { SettingView };

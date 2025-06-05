import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAppContext } from 'contexts/AppProvider';
import { seasonOptions } from 'common/const';
import { addCookieItem, fetchCookieList, updateCookieItem, deleteItem } from 'services/info';

const SettingView = () => {
  const context = useAppContext();
  const { ckOptions } = context;
  const [ck, setCk] = useState(context?.ck || ckOptions[0].value);
  const [seasonid, setSeasonid] = useState(context?.seasonid || '3');
  const [customCk, setCustomCk] = useState('');
  const [newCookieLabel, setNewCookieLabel] = useState(''); // 新增 Cookie 标签
  const [newCookieValue, setNewCookieValue] = useState(''); // 新增 Cookie 值
  const [isEditing, setIsEditing] = useState(false); // 是否处于编辑模式
  const [editingLabel, setEditingLabel] = useState(''); // 当前编辑的 Cookie 标签

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

  // 新增 Cookie
  const handleAddCookie = useCallback(async () => {
    if (!newCookieLabel || !newCookieValue) return;
    const response = await addCookieItem({
      label: newCookieLabel,
      value: newCookieValue,
    });
    if (response) {
      // 刷新 Cookie 列表
      const newCkOptions = await fetchCookieList();
      context?.updateConfig?.({ ckOptions: newCkOptions });
      // 清空输入
      setNewCookieLabel('');
      setNewCookieValue('');
    }
  }, [newCookieLabel, newCookieValue, context]);

  // 修改 Cookie
  const handleUpdateCookie = useCallback(async () => {
    if (!editingLabel || !newCookieValue) return;
    const response = await updateCookieItem(editingLabel, newCookieValue);
    if (response) {
      // 刷新 Cookie 列表
      const newCkOptions = await fetchCookieList();
      context?.updateConfig?.({ ckOptions: newCkOptions });
      // 退出编辑模式
      setIsEditing(false);
      setEditingLabel('');
      setNewCookieValue('');
    }
  }, [editingLabel, newCookieValue, context]);

  // 进入编辑模式（从下拉框选择触发）
  const enterEditMode = useCallback((label: string, value: string) => {
    setIsEditing(true);
    setEditingLabel(label);
    setNewCookieValue(value);
    setNewCookieLabel(label); // 标签不可修改，保持原值
  }, []);

  // 新增 Cookie 管理区域
  const handleDeleteCookie = useCallback(async () => {
    if (!editingLabel) return;
    const response = await deleteItem(editingLabel);
    if (response) {
      // 刷新 Cookie 列表
      const newCkOptions = await fetchCookieList();
      context?.updateConfig?.({ ckOptions: newCkOptions });
      // 退出编辑模式
      setIsEditing(false);
      setEditingLabel('');
      setNewCookieValue('');
    }
  }, [editingLabel, context]);

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
            onChange={(e) => {
              const selectedValue = e.target.value;
              setCk(selectedValue);
              // 当选择非"custom"选项时触发编辑模式
              if (selectedValue !== 'custom') {
                const selectedOption = ckOptions.find((opt) => opt.value === selectedValue);
                if (selectedOption) {
                  enterEditMode(selectedOption.label, selectedOption.value);
                }
              } else {
                setIsEditing(false); // 选择自定义时退出编辑模式
              }
            }}
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

        <div className="space-y-2" style={{ display: 'none' }}>
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

        {/* 新增 Cookie 管理区域 */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium">Cookie 管理</h2>
          <div className="space-y-2">
            <input
              type="text"
              value={newCookieLabel}
              onChange={(e) => setNewCookieLabel(e.target.value)}
              placeholder="Cookie 标签（新增/编辑）"
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              disabled={isEditing} // 编辑模式下标签不可修改
            />
            <input
              type="text"
              value={newCookieValue}
              onChange={(e) => setNewCookieValue(e.target.value)}
              placeholder="Cookie 值（新增/编辑）"
              className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              {!isEditing ? (
                <button
                  onClick={handleAddCookie}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                >
                  新增 Cookie
                </button>
              ) : (
                <>
                  <button
                    onClick={handleUpdateCookie}
                    className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
                  >
                    保存修改
                  </button>
                  <button
                    onClick={handleDeleteCookie}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                  >
                    删除
                  </button>
                </>
              )}
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
                >
                  取消编辑
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 原有保存按钮（仅保留自定义模式的保存） */}
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

export default SettingView;

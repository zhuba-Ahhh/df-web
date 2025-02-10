export const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatNumber = (num: string | number) => {
  return Number(num).toLocaleString('zh-CN');
};

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}分${remainingSeconds}秒`;
};

export const getStatusText = (escapeFailReason: number) => {
  return escapeFailReason === 1 ? '撤离成功' : '撤离失败';
};

export const getStatusColor = (escapeFailReason: number) => {
  return escapeFailReason === 1 ? 'text-green-500' : 'text-red-500';
};

export const getStatusColor1 = (flowCalGainedPrice: number) => {
  return flowCalGainedPrice > 0 ? 'text-green-500' : 'text-red-500';
};

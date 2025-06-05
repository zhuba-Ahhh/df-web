export const getLastNumbersFromUrl = (url: string) => {
  // 使用正则表达式匹配URL路径中的所有数字
  const regex = /\d+/g;
  const matches = url.match(regex);
  // 如果匹配成功，则将匹配的数字字符串转换为整数数组，否则返回空数组
  return matches ? matches.map(Number) : [];
};

export const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return remainingSeconds > 0 ? `${minutes}分${remainingSeconds}秒` : `${minutes}分钟`;
};

/**
 * 将数字格式化为 K（千）或 M（百万）或 B (十亿) 单位，并保留一位小数。
 * @param num 要格式化的数字。
 * @returns 格式化后的字符串。
 */
export const formatNumberToKMB = (num: number | string): string => {
  const number = typeof num === 'string' ? parseFloat(num) : num;

  if (isNaN(number)) {
    return String(num); // 如果不是有效数字，返回原始值
  }

  if (Math.abs(number) >= 1000000000) {
    // 新增对 B (十亿) 的判断
    return (number / 1000000000).toFixed(2) + 'B';
  }
  if (Math.abs(number) >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  }
  if (Math.abs(number) >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return number.toString();
};

/**
 * 将秒数格式化为 HH:MM:SS 字符串。
 * @param totalSeconds 总秒数。
 * @returns 格式化后的 HH:MM:SS 字符串。
 */
export const formatCountdown = (totalSeconds: number): string => {
  if (isNaN(totalSeconds) || totalSeconds < 0) {
    return '00:00:00';
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

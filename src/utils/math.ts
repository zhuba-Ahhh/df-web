export const getLastNumbersFromUrl = (url: string) => {
  // 使用正则表达式匹配URL路径中的所有数字
  const regex = /\d+/g;
  const matches = url.match(regex);
  // 如果匹配成功，则将匹配的数字字符串转换为整数数组，否则返回空数组
  return matches ? matches.map(Number) : [];
};

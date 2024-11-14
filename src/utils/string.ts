// 解析链接
export const resolveUrl = (url: string) => {
  const match = url.match(/(\d+)\/(\d+)/);

  return [match?.[1] || '', match?.[2] || ''];
};

// 字符超长省略
export const truncateString = (
  str: string,
  maxLength: number = 12,
  trailing: string = '...'
): string => {
  if (str?.length > maxLength) {
    return str.substring(0, maxLength - trailing.length) + trailing;
  } else {
    return str;
  }
};

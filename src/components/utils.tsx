export const getRank = (point: string, rankMap: Record<string, string>) => {
  const rankPoint = Number(point);
  const ranks = Object.entries(rankMap).sort((a, b) => Number(a[0]) - Number(b[0]));

  for (const [threshold, rankName] of ranks) {
    if (rankPoint <= Number(threshold)) {
      return rankName;
    }
  }
  return rankMap['6000'] || '未知段位';
};

export const formatDuration = (seconds: string) => {
  const totalMinutes = Math.floor(Number(seconds) / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h${minutes}m`;
};

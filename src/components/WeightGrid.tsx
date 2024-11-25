import React from 'react';

type WeightGridProps = {
  width: number;
  length: number;
};

const WeightGrid: React.FC<WeightGridProps> = ({ width, length }) => {
  // 定义行和列的数量
  const rows = 4;
  const cols = 7;

  // 生成格子的函数
  const generateCells = (): JSX.Element[] => {
    const cells: JSX.Element[] = [];

    for (let i = 0; i < rows; i++) {
      const rows = [];
      for (let j = 0; j < cols; j++) {
        // 判断是否为实心格子
        const isSolid = i < width && j < length;
        const cellStyle: React.CSSProperties = {
          width: '8px',
          height: '8px',
          border: '1px solid black',
          display: 'inline-block',
          backgroundColor: isSolid ? 'black' : 'transparent',
          marginRight: 1,
        };

        rows.push(<div key={`${i}-${j}`} style={cellStyle}></div>);
      }
      cells.push(
        <div key={i} style={{ height: 8, marginBottom: 1 }}>
          {rows}
        </div>
      );
    }

    return cells;
  };

  return <div>{generateCells()}</div>;
};

export default WeightGrid;

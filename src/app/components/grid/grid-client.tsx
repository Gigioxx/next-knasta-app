'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type GridType = boolean[][];

const rotateGrid = (grid: GridType, direction: 'clockwise' | 'counterclockwise'): GridType => {
  const n = grid.length;
  const newGrid = Array.from({ length: n }, () => Array(n).fill(false));

  if (direction === 'clockwise') {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        newGrid[j][n - 1 - i] = grid[i][j];
      }
    }
  } else if (direction === 'counterclockwise') {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        newGrid[n - 1 - j][i] = grid[i][j];
      }
    }
  }

  return newGrid;
};

const GridClient: React.FC<{ initialState: GridType }> = ({ initialState }) => {
  const router = useRouter();
  const [selectedSquares, setSelectedSquares] = useState<GridType>(initialState);

  const handleSquareClick = (row: number, col: number) => {
    const newSelectedSquares = selectedSquares.map((rowArray, rowIndex) =>
      rowArray.map((square, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return !square;
        }

        return square;
      }),
    );

    setSelectedSquares(newSelectedSquares);

    const coordinates = newSelectedSquares
      .flatMap(
        (rowArray, rowIndex) =>
          rowArray.map((square, colIndex) => (square ? `${rowIndex + 1}-${colIndex + 1}` : null)), // Adjust for 1-based indexing
      )
      .filter((coord) => coord !== null)
      .join(',');

    const params = new URLSearchParams(window.location.search);

    params.set('state', coordinates);
    router.replace(`?${params.toString()}`);
  };

  const handleRotate = (direction: 'clockwise' | 'counterclockwise') => {
    const rotatedGrid = rotateGrid(selectedSquares, direction);

    setSelectedSquares(rotatedGrid);

    const coordinates = rotatedGrid
      .flatMap(
        (rowArray, rowIndex) =>
          rowArray.map((square, colIndex) => (square ? `${rowIndex + 1}-${colIndex + 1}` : null)), // Adjust for 1-based indexing
      )
      .filter((coord) => coord !== null)
      .join(',');

    const params = new URLSearchParams(window.location.search);

    params.set('state', coordinates);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <button
        className='m-4 p-2 bg-white border border-purple-500 text-black'
        onClick={() => handleRotate('counterclockwise')}
      >
        Rotate -90°
      </button>
      <div>
        <div className='grid grid-cols-5 gap-1 max-w-64'>
          {selectedSquares.map((row, rowIndex) =>
            row.map((isSelected, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`h-12 w-12 border ${isSelected ? 'bg-purple-500' : 'bg-gray-300'} border-white`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              />
            )),
          )}
        </div>
      </div>
      <button
        className='m-4 p-2 bg-white border border-purple-500 text-black'
        onClick={() => handleRotate('clockwise')}
      >
        Rotate 90°
      </button>
    </div>
  );
};

export default GridClient;

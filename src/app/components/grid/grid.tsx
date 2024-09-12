'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type GridType = boolean[][];

const GRID_SIZE = 5;

const createEmptyGrid = (): GridType =>
  Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(false));

const getInitialState = (): GridType => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const state = params.get('state');

    if (state) {
      try {
        const coordinates = state.split(',').map((coord) => coord.split('-').map(Number));
        const initialState = createEmptyGrid();

        coordinates.forEach(([row, col]) => {
          initialState[row - 1][col - 1] = true; // Adjust for 1-based indexing
        });

        return initialState;
      } catch (error) {
        console.error('Error parsing state:', error);
      }
    }
  }

  return createEmptyGrid();
};

const rotateGrid = (grid: GridType, direction: 'clockwise' | 'counterclockwise'): GridType => {
  const newGrid = createEmptyGrid();

  if (direction === 'clockwise') {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        newGrid[j][GRID_SIZE - 1 - i] = grid[i][j];
      }
    }
  } else if (direction === 'counterclockwise') {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        newGrid[GRID_SIZE - 1 - j][i] = grid[i][j];
      }
    }
  }

  return newGrid;
};

const Grid: React.FC = () => {
  const router = useRouter();
  const [selectedSquares, setSelectedSquares] = useState<GridType>(createEmptyGrid());

  useEffect(() => {
    setSelectedSquares(getInitialState());
  }, []);

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
    updateURLParams(newSelectedSquares);
  };

  const handleRotate = (direction: 'clockwise' | 'counterclockwise') => {
    const rotatedGrid = rotateGrid(selectedSquares, direction);

    setSelectedSquares(rotatedGrid);
    updateURLParams(rotatedGrid);
  };

  const updateURLParams = (grid: GridType) => {
    const coordinates = grid
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

export default Grid;

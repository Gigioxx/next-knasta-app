import GridClient from './grid-client';

type GridType = boolean[][];

const getInitialState = (): GridType => {
  return Array.from({ length: 5 }, () => Array(5).fill(false));
};

const parseStateFromURL = (url: string): GridType => {
  const params = new URLSearchParams(url);
  const state = params.get('state');

  if (state) {
    try {
      const coordinates = state.split(',').map((coord) => coord.split('-').map(Number));
      const initialState = Array.from({ length: 5 }, () => Array(5).fill(false));

      coordinates.forEach(([row, col]) => {
        initialState[row - 1][col - 1] = true; // Adjust for 1-based indexing, so the first square is at (1, 1) instead of (0, 0)
      });

      return initialState;
    } catch (error) {
      console.error('Failed to parse state from URL:', error);
    }
  }

  return getInitialState();
};

const GridServer: React.FC<{ url: string }> = ({ url }) => {
  const initialState = parseStateFromURL(url);

  return <GridClient initialState={initialState} />;
};

export default GridServer;

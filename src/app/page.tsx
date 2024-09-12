import Grid from './components/grid/grid';

export default function Home() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div>
        <h1 className='text-center'>Home</h1>
        <Grid />
      </div>
    </div>
  );
}

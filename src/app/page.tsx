import GridServer from './components/grid/grid-server';

export default function Home() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <div>
        <h1 className='text-center'>Home</h1>
        <GridServer url={typeof window !== 'undefined' ? window.location.search : ''} />
      </div>
    </div>
  );
}

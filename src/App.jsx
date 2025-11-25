import { Outlet } from 'react-router-dom';
import Navigator from './components/Navigator';

function App() {
  return (
    <div>
      <Navigator />
      <main className="container mx-auto p-12">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import Navigator from './components/Navigator';

function App() {
  return (
    <div>
      <Header />
      <Navigator />
      <main className="container mx-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
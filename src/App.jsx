import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import Navigator from './components/Navigator';
import { AuthProvider } from './contexts/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <div>
        <Header />
        <Navigator />
        <main className="container mx-auto p-8">
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
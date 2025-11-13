import { Outlet } from 'react-router-dom';
import Navigator from './components/Navigator';

import styles from './App.module.css';

function App() {
  return (
    <div>
      <Navigator />
      <main className={styles.navigator}>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
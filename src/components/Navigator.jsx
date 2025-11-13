import { Link } from 'react-router-dom';
import styles from './Navigator.module.css';

function Navigator() {
  return (
    <nav className={styles.navContainer}>
      <Link to="/" className={styles.navLink}>
        메인 페이지
      </Link>
      <Link to="/debate" className={styles.navLink}>
        토론 페이지
      </Link>
    </nav>
  );
}

export default Navigator;
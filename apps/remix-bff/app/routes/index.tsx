import { Link } from 'remix';
import styles from '../styles/index.css';

export const links = () => [{ rel: 'stylesheet', href: styles }];

export default function Index() {
  return (
    <div className="container">
      <div>
        <h1>Welcome to Remix</h1>
        <div style={{ textAlign: 'center' }}>
          <Link to="ssr">SSR</Link>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Link to="csr">CSR</Link>
        </div>
      </div>
    </div>
  );
}

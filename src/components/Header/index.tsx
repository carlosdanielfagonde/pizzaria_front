import { useContext } from 'react';
import styles from './styles.module.scss';
import Link from 'next/link';

import { FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../../contexts/AuthContext';

export function Header() {
    const { signOut } = useContext(AuthContext);

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/">
                    <img src="/logo.svg" width={190} height={60} />
                </Link>

                <nav className={styles.menu}>
                    <Link legacyBehavior href="/category">
                        <a>Categoria</a>
                    </Link>

                    <Link legacyBehavior href="/product">
                        <a>Cardápio</a>
                    </Link>
                    <button onClick={signOut}>
                        <FiLogOut className={styles.logout} />
                    </button>
                </nav>
            </div>
        </header>
    )
}
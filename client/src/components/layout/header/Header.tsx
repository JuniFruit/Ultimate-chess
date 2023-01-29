import { FC, lazy, Suspense } from "react";
import { Logo } from "../../ui/logo/Logo";
import styles from './Header.module.scss';

const RightElements = lazy(() => import("./right-elements/RightElements"));

const Header: FC = () => {

    return (
        <header className={styles.header}>
            <Logo />
            <Suspense fallback={null}>
                <RightElements />
            </Suspense>
        </header>
    )
}

export default Header
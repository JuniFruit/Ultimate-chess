import { FC, lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { InfoPop } from "../ui/SuspenseWrapper";
import styles from './Layout.module.scss';

const Header = lazy(() => import("./header/Header"));

const Layout: FC = () => {
    return (
        <main className={styles.main}>
            <div className={styles.page}>
                <Header />
                <div className={styles.wrapper}>
                    <Suspense fallback={null}>
                        <Outlet />
                    </Suspense>
                </div>
                <InfoPop />
            </div>
        </main>
    )
}

export default Layout;
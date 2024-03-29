import { FC, lazy, Suspense, useState, useTransition } from 'react'
import { useAdminAuth } from '../../../hooks/useAdminAuth'
import { useIsMobile } from '../../../hooks/useMobile'
import { setTabTitle } from '../../../utils/general.utils'
import ProfileMenu from '../../layout/header/right-elements/profile-menu/ProfileMenu'
import { Button } from '../../ui/button/Button'
import styles from './Admin.module.scss'
import { adminMenuData } from './adminMenuData'
const AdminHome = lazy(() => import('./home/AdminHome'));
const AdminPacks = lazy(() => import('./packs/AdminPacks'));
const AdminPlayers = lazy(() => import('./players/AdminPlayers'));

const AdminPage: FC = () => {

    useAdminAuth();
    const [activeWindow, setActiveWindow] = useState<"Packs" | "Home" | "Players">('Home')
    const { isMobile } = useIsMobile()
    const [isPending, setStartTransition] = useTransition()

    const handleChangePage = (page: "Packs" | "Home" | "Players") => {
        setStartTransition(() => {
            setActiveWindow(page);
        })
    }
    setTabTitle(`Ultimate Chess Admin ${activeWindow}`);

    return (

        <section className={styles.admin_container}>
            <div className={styles.main_wrapper}>
                <div className={styles.admin_wrapper}>
                    <div className={styles.admin_header}>
                        <h2>{activeWindow}</h2>
                        <ProfileMenu />
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.admin_body}>
                        <Suspense fallback={null}>
                            {activeWindow === 'Home' ? <AdminHome /> : null}
                            {activeWindow === 'Packs' ? <AdminPacks /> : null}
                            {activeWindow === 'Players' ? <AdminPlayers /> : null}
                        </Suspense>
                    </div>
                </div>
                <nav className={styles.menu_wrapper}>
                    {
                        adminMenuData.map(item => {
                            if (isMobile && item.title === 'Players') return null;
                            return <Button key={item.title}
                                className={`${activeWindow === item.title ? styles.link_active : ''}`}
                                title={item.title}
                                value={item.title}
                                aria-label={item.title}
                                onClick={() => handleChangePage(item.title as any)}
                            >
                                <span>{<item.icon />}</span>
                            </Button>
                        })
                    }
                </nav>

            </div>
        </section>



    )
}

export default AdminPage
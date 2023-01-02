import { FC } from "react";
import { NavLink } from "react-router-dom";
import { useIsMobile } from "../../../../hooks/useMobile";
import { adminMenu } from "./AdminMenu.data";
import { IAdminMenu } from "./AdminMenu.interface";
import styles from './AdminMenu.module.scss';

const AdminMenu: FC = () => {

    const menuItems: IAdminMenu[] = adminMenu;
    const { isMobile } = useIsMobile();
    return (
        <nav className={styles.menu_wrapper}>
            {
                menuItems.map(item => {
                    if (isMobile && item.link === '/admin/players') return null;
                    return <NavLink to={item.link} key={item.link}
                        className={({ isActive }) => isActive ? styles.link_active : ''}
                        title={item.title}
                    >
                        <span>{<item.icon />}</span>
                    </NavLink>
                })
            }
        </nav>
    )
}

export default AdminMenu;
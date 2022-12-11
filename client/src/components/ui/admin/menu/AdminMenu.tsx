import { FC } from "react";
import { NavLink } from "react-router-dom";
import { adminMenu } from "./AdminMenu.data";
import { IAdminMenu } from "./AdminMenu.interface";
import styles from './AdminMenu.module.scss';

const AdminMenu: FC = () => {

    const menuItems: IAdminMenu[] = adminMenu;

    return (
        <nav className={styles.menu_wrapper}>
            {
                menuItems.map(item => (
                    <NavLink to={item.link}
                    className={({ isActive }) => isActive ? styles.link_active : ''}
                    >
                        <span>{<item.icon />}</span>
                    </NavLink>
                ))
            }
        </nav>
    )
}

export default AdminMenu;
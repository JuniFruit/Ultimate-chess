import { FC } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import { MainMenuButton } from "../../../ui/main-menu-button/MainMenuButton";
import { IMenuData } from "./Menu.interface";
import styles from './Menu.module.scss';

const Menu: FC<{ items: IMenuData[] }> = ({ items }) => {

    const {user} = useAuth();

    return (
        <nav className={styles.wrapper}>
            <div className={styles.menu_box}>
                {items.map(item => {
                    if (item.link === '/packs' && !user) return null;
                    if (item.link === '/register' && user) return null;
                    return <MainMenuButton {...item} key={item.link} />
                })}
            </div>
        </nav>
    )
}

export default Menu;
import { FC } from "react";
import { NavLink } from "react-router-dom";
import { IMenuData } from "../../pages/home/main-menu/Menu.interface";
import styles from './MenuButton.module.scss';

export const MainMenuButton: FC<IMenuData> = ({link, title}) => {

    return (
        <NavLink to={`${link}`} className={styles.button_wrapper}>
            <div>{title}</div>
        </NavLink>
    )
}
import { FC } from "react";
import { Logo } from "../../ui/logo/Logo";
import styles from './Header.module.scss';
import { RightElements } from "./right-elements/RightElements";

const Header: FC = () => {

    return (
        <header className={styles.header}>
            <Logo />
            <RightElements />
        </header>
    )
}

export default Header
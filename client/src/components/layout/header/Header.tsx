import { FC } from "react";
import styles from './Header.module.scss';
import { RightElements } from "./right-elements/RightElements";

const Header: FC = () => {

    return (
        <header className={styles.header}>
            <RightElements />
        </header>
    )
}

export default Header
import { FC, PropsWithChildren } from "react";
import { IButton } from '../button/Button.interface';
import styles from './MenuButton.module.scss';

const MenuButton: FC<PropsWithChildren<IButton>> = ({ children, ...rest }) => {

   

    return (
        <button {...rest}
            className={styles.button_wrapper}          
        >
            <div>{children}</div>
            
        </button>
    )
}

export default MenuButton;
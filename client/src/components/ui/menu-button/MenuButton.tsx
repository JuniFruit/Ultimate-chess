import { FC, PropsWithChildren, TouchEventHandler, useEffect, useState } from "react";
import { IButton } from '../button/Button.interface';
import styles from './MenuButton.module.scss';

const MenuButton: FC<PropsWithChildren<IButton>> = ({ children, ...rest }) => {

    const [isTouched, setIsTouched] = useState(false);
 

    useEffect(() => {
        if (!isTouched) return
        const timeout = setTimeout(() => {
            setIsTouched(prev => false);
        }, 500)

        return () => {
            clearTimeout(timeout);
        }

    }, [isTouched])

    const handleTouch: TouchEventHandler<HTMLButtonElement> = (e) => {
        setIsTouched(prev => true);
    }

    return (
        <button {...rest}
            className={styles.button_wrapper}
            onTouchStart={handleTouch}
        >
            <div>{children}</div>
            {isTouched
                ?
                <span
                    className={styles.ripple}></span>
                : null
            }
        </button>
    )
}

export default MenuButton;
import { FC, PropsWithChildren } from "react"
import { mockups } from "../../../assets/mockups/images";
import { IButton } from "./Button.interface"
import styles from './Button.module.scss';

export const Button: FC<PropsWithChildren<IButton>> = ({
    children,
    className,
    ...rest
}) => {
    return (
        <button
            className={className ? className : styles.button} {...rest}
            style={{background: `url(${mockups.woodenBG})`}}
        >
            {children}
        </button>
    )
}
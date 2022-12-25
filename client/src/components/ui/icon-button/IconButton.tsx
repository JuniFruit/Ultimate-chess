import { FC, PropsWithChildren } from "react"
import { IButton } from "../button/Button.interface"
import styles from './IconButton.module.scss';


export const IconButton: FC<PropsWithChildren<IButton>> = ({ className, children, ...rest }) => {



    return (
        <button
            className={className ? className : styles.icon_button} {...rest}
        >
            {children}
        </button>
    )
}
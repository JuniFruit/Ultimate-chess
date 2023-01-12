import { FC, PropsWithChildren } from "react"
import { IButton } from "./Button.interface"
import styles from './Button.module.scss';

export const Button: FC<PropsWithChildren<IButton>> = ({
    children,
    className,
    ...rest
}) => {

    return (
        <button
            className={className ? className : styles.button} 
            {...rest}   
            tabIndex={0}       
        >
            {children}
           
        </button>
    )
}
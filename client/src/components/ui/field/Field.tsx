import { forwardRef } from "react";
import { IField } from "./Field.interface";
import styles from './Field.module.scss';

const Field = forwardRef<HTMLInputElement, IField>(
    ({ error, type = 'text', style,title, ...rest }, ref) => {
        
        return <div className={styles.input} style={style}>
            {title && <h3 className={styles.title}>{title}</h3>}
            <input ref={ref} type={type} {...rest}></input>
            {error && <div className={styles.error}>{error.message}</div>}
        </div>
    }
)

export default Field
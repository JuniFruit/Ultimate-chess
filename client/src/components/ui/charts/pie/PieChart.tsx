import { FC, useRef } from 'react';
import styles from './PieChart.module.scss';

export const PieChart: FC<{ value: number }> = ({ value }) => {

    const pieBefore = useRef<HTMLDivElement>(null);
    const pieAfter = useRef<HTMLDivElement>(null);

    const setValue = () => {
        if (pieAfter.current && pieBefore.current) {
            console.log(pieAfter.current, pieBefore.current)
            pieBefore.current.style.background = `radial-gradient(farthest-side,var(--complimentary) 98%,#0000) top/var(--borderThickness) var(--borderThickness) no-repeat,
            conic-gradient(var(--complimentary) calc(${value}*1%),#0000 0);`;

            pieAfter.current.style.transform = `rotate(calc(${value}*3.6deg)) translateY(calc(50% - var(--width)/2));`

        }
    }


    return (
        <div className={styles.pie}

        >
            <div className={styles.before} ref={pieBefore}
                style={{
                    background: `radial-gradient(farthest-side,var(--complimentary) 98%,#0000) top/var(--borderThickness) var(--borderThickness) no-repeat,
                conic-gradient(var(--complimentary) calc(${value}*1%),#0000 0)`
                }}
            ></div>
            <>
                {!isNaN(value) ? `${value}%` : 'No data'}
            </>
            <div className={styles.after} ref={pieAfter}
                style={{ transform: `rotate(calc(${value}*3.6deg)) translateY(calc(50% - var(--width)/2))` }}
            ></div>

        </div>
    )
}
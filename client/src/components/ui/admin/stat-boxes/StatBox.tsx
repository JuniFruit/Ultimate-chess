import { FC } from "react";
import { formatToKilo } from "../../../../utils/format.utils";
import { Curve } from "../../misc/curve-element/Curve";
import { IStatBox } from "./StatBox.interface";
import styles from './StatBox.module.scss';


export const StatBox: FC<IStatBox> = ({ title, stats, svgIcon }) => {

    return (
        <div className={styles.box_wrapper}>
            <div className={styles.box_header}>
                {svgIcon}
            </div>
            <h3>{title}</h3>
            <span>{formatToKilo(stats)}</span>
            <div className={styles.misc_curve}>
                <Curve />
            </div>
        </div>
    )
}
import { formatToKilo } from "../../../../utils/format.utils"
import { FC } from 'react'
import { IStatItem } from "./StatItem.interface"
import styles from './Stat.module.scss';

export const StatColumnItem: FC<IStatItem> = ({ value, valueTitle }) => {


    return (
        <div className={styles.stat_wrapper}>
            <h3>{valueTitle}</h3>
            <span>{formatToKilo(value)}</span>
        </div>
    )
}
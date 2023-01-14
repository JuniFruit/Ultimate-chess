import { FC } from "react";
import { IPack } from "../../../../types/pack.interface";
import { formatToKilo } from "../../../../utils/format.utils";
import { ImagePreview } from "../../SuspenseWrapper";
import styles from './Items.module.scss';

interface IPackItem extends Pick<IPack, "id" | "sysName" | "title" | "preview"> {
    ownerCount: number;
    onClick: () => void;
}

export const PackItem: FC<IPackItem> = ({ id, sysName, title, preview, ownerCount, onClick }) => {


    return (
        <div
            className={styles.item_container}
            onClick={onClick}
            tabIndex={0}
        >
            <ImagePreview imageSrc={preview} />
            <span>ID: {id}</span>
            <div className={styles.pack_names}>
                <h3>Game Title: {title}</h3>
                <h3>Sys Title: {sysName}</h3>
            </div>
            <span className={styles.using}>Currently using: {formatToKilo(ownerCount)}</span>

        </div>
    )
} 
import { FC } from "react";
import { IPack } from "../../../../types/pack.interface";
import { formatToKilo } from "../../../../utils/format.utils";
import { ImagePreview } from "../../image-preview/ImagePreview";
import styles from './Items.module.scss';

interface IPackItem extends Pick<IPack, "id" | "sysName" | "title" | "preview"> {
    ownerCount: number;
}

export const PackItem: FC<IPackItem> = ({id, sysName, title, preview, ownerCount}) => {

    return (
        <div className={styles.pack_wrapper}>
            <ImagePreview imageSrc={preview}/>
            <span>ID: {id}</span>
            <div className={styles.pack_names}>
                <h3>Game Title: {title}</h3>
                <h3>Sys Title: {sysName}</h3>
            </div>
            <span>Currently using: {formatToKilo(ownerCount)}</span>

        </div>
    )
} 
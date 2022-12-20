import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart } from "../../../ui/charts/pie/PieChart";
import { ImagePreview } from "../../../ui/image-preview/ImagePreview";
import { IProfileBody } from "./ProfileBody.interface";
import styles from './ProfileBody.module.scss';


export const ProfileBody: FC<IProfileBody> = ({packInUse, lossesCount, winsCount}) => {

    const navigate = useNavigate()

    return (
        <div className={styles.body_wrapper}>
            <div className={styles.item}>
                <h2>Win rate</h2>
                <PieChart value={Math.floor((winsCount / (lossesCount + winsCount)) * 100)} />
            </div>
            <div className={`${styles.item} ${styles.item_img}`}  onClick={() => navigate(`/packs`)}>
                <h2>Pack in use</h2>
                <ImagePreview imageSrc={packInUse?.preview} />
            </div>

        </div>
    )
}
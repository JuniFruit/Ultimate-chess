import { PackMenu } from "./packs-data/PacksMenu"
import { FC, useState } from 'react';
import { ImagePreview } from "../../ui/image-preview/ImagePreview";
import { packApi } from "../../../store/api/pack.api";
import styles from '../home/main-menu/Menu.module.scss';
import packStyles from './Packs.module.scss';

import { Layout } from "../../layout/Layout";

const Packs: FC = () => {
    const [previewSrc, setPreviewSrc] = useState('');
    const { data: packs } = packApi.useGetPacksQuery(null);

    return (
        <Layout title="Ultimate Chess Packs">
            <div className={`${styles.wrapper} ${packStyles.wrapper}`}>
                <ImagePreview imageSrc={previewSrc} />
                <PackMenu
                    packs={packs || []}
                    setPreview={setPreviewSrc}
                />
            </div>
        </Layout>
    )
}

export default Packs;
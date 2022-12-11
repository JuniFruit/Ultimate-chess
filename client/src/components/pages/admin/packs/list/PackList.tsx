import { FC } from "react";
import { packApi } from "../../../../../store/api/pack.api";
import { PackItem } from "../../../../ui/admin/items/PackItem";
import styles from './PackList.module.scss';

export const PackList: FC = () => {

    const { data: packs } = packApi.useGetPacksQuery(null);


    return (
        <div className={styles.pack_list_wrapper}>
            {
                packs?.length 
                ?
                packs.map(pack => (
                    <PackItem 
                        {...{...pack}}
                        ownerCount={pack.owner.length}
                        key={pack.id}
                    />
                ))
                : null 
            }
        </div>
    )
}
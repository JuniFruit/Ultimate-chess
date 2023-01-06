import { FC } from "react";
import { packApi } from "../../../../../store/api/pack.api";
import { PackItem } from "../../../../ui/admin/items/PackItem";
import { Spinner } from "../../../../ui/loading/Spinner";
import styles from './PackList.module.scss';

export const PackList: FC<{ onClick: (packId: number) => void }> = ({ onClick }) => {

    const { data: packs, isLoading } = packApi.useGetPacksQuery(null);

    if (isLoading) return <Spinner />

    return (
        <div className={styles.pack_list_wrapper}>
            {
                packs?.length
                    ?
                    packs.map(pack => (
                        <PackItem
                            {...{ ...pack }}
                            ownerCount={pack.owner.length}
                            onClick={() => onClick(pack.id)}
                            key={pack.id}
                        />
                    ))
                    : null
            }
        </div>
    )
}
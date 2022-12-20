import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { packApi } from "../../../../../store/api/pack.api";
import { PackItem } from "../../../../ui/admin/items/PackItem";
import styles from './PackList.module.scss';

export const PackList: FC = () => {

    const { data: packs } = packApi.useGetPacksQuery(null);

    const navigate = useNavigate();

    const handleClick = (id:number) => {
        navigate(`/admin/packs/edit/${id}`)
    }
    return (
        <div className={styles.pack_list_wrapper}>
            {
                packs?.length 
                ?
                packs.map(pack => (
                    <PackItem 
                        {...{...pack}}
                        ownerCount={pack.owner.length}
                        onClick={() => handleClick(pack.id)}
                        key={pack.id}
                    />
                ))
                : null 
            }
        </div>
    )
}
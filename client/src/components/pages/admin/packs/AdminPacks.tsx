import { FC, useState } from "react";
import { Button } from "../../../ui/button/Button";
import { PackAddForm } from "./add-pack/PackAdd";
import styles from './AdminPacks.module.scss';
import PackEdit from "./edit-pack/PackEdit";
import { PackList } from "./list/PackList";

const AdminPacks: FC = () => {


    const [activeWindow, setActiveWindow] = useState<"list" | "add" | 'pack'>('list');
    const [currentPackId, setCurrentPackId] = useState(0);

    const handleOpenPack = (packId: number) => {
        setActiveWindow(prev => 'pack');
        setCurrentPackId(prev => packId);
    }

    return (

        <div className={styles.packs_wrapper}>
            <div className={styles.buttons}>
                <Button onClick={() => setActiveWindow("list")}>List</Button>
                <Button onClick={() => setActiveWindow("add")}>Add a pack</Button>
            </div>
            {activeWindow === 'list' ? <PackList onClick={handleOpenPack} /> : null}
            {activeWindow === 'add' ? <PackAddForm /> : null}
            {activeWindow === 'pack' && currentPackId !== 0 ? <PackEdit id={currentPackId} /> : null}
        </div>

    )
}


export default AdminPacks;
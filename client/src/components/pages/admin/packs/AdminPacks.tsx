import { FC, useState } from "react";
import { AdminPanel } from "../../../ui/admin/main/AdminPanel";
import { Button } from "../../../ui/button/Button";
import { useAdminAuth } from "../../../../hooks/useAdminAuth";
import { PackAddForm } from "./add-pack/PackAdd";
import styles from './AdminPacks.module.scss';
import { PackList } from "./list/PackList";

const AdminPacks: FC = () => {
    useAdminAuth();
    const [activeWindow, setActiveWindow] = useState<"list" | "add">('list');


    return (
        <AdminPanel title="Packs">
            <div className={styles.packs_wrapper}>
                <div className={styles.buttons}>
                    <Button onClick={() => setActiveWindow("list")}>List</Button>
                    <Button onClick={() => setActiveWindow("add")}>Add a pack</Button>
                </div>
                {activeWindow === 'list' ? <PackList /> : null}
                {activeWindow === 'add' ? <PackAddForm /> : null}
            
            </div>
        </AdminPanel>
    )
}


export default AdminPacks;
import { FC } from "react";
import { IoAccessibility, IoWifiSharp } from "react-icons/io5";
import { AdminPanel } from "../../../ui/admin/main/AdminPanel";
import { StatBox } from "../../../ui/admin/stat-boxes/StatBox";
import { useAdminAuth } from "../../../../hooks/useAdminAuth";
import styles from './AdminHome.module.scss';
import { useAdminHome } from "./useAdminHome";


const AdminHome: FC = () => {
    useAdminAuth();

    const {ping, error} = useAdminHome();

    return (
        <AdminPanel title="Home">
            <div className={styles.data_wrapper}>
                <StatBox
                    title="Ping"
                    svgIcon={<IoWifiSharp />}
                    stats={error ? error : ping}
                    key={`id142155216621`}
                />
                <StatBox
                    title="Players"
                    svgIcon={<IoAccessibility />}
                    stats={599999}
                />
                
            </div>
        </AdminPanel>
    )
}

export default AdminHome
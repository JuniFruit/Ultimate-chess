import { FC } from "react";
import { IoAccessibility, IoGameController, IoWifiSharp } from "react-icons/io5";
import { StatBox } from "../../../ui/admin/stat-boxes/StatBox";
import { useAdminHome } from "./useAdminHome";
import styles from './AdminHome.module.scss';


const AdminHome: FC = () => {

    const { ping, error, players, rooms } = useAdminHome();
    return (
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
                stats={players}
            />
            <StatBox
                title="Rooms"
                svgIcon={<IoGameController />}
                stats={rooms}
            />

        </div>
    )
}

export default AdminHome
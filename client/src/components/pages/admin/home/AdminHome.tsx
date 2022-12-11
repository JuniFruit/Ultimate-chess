import { FC } from "react";
import { IoAccessibility } from "react-icons/io5";
import { AdminPanel } from "../../../ui/admin/main/AdminPanel";
import { StatBox } from "../../../ui/admin/stat-boxes/StatBox";
import styles from './AdminHome.module.scss';


const AdminHome: FC = () => {

    return (
        <AdminPanel title="Home">
            <div className={styles.data_wrapper}>
                <StatBox
                    title="players"
                    svgIcon={<IoAccessibility />}
                    stats={599999}
                />
                <StatBox
                    title="players"
                    svgIcon={<IoAccessibility />}
                    stats={599999}
                />
                <StatBox
                    title="players"
                    svgIcon={<IoAccessibility />}
                    stats={599999}
                />
                <StatBox
                    title="players"
                    svgIcon={<IoAccessibility />}
                    stats={599999}
                />
            </div>
        </AdminPanel>
    )
}

export default AdminHome
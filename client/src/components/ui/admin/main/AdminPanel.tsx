import { FC, PropsWithChildren } from "react";
import ProfileMenu from "../../../layout/header/right-elements/profile-menu/ProfileMenu";
import { Layout } from "../../../layout/Layout";
import AdminMenu from "../menu/AdminMenu";
import styles from './AdminPanel.module.scss';

export const AdminPanel: FC<PropsWithChildren<{ title: string }>> = ({ children, title }) => {

    return (
        <Layout title={`Ultimate Chess Admin ${title}`}>

            <section className={styles.admin_container}>
                <div className={styles.main_wrapper}>
                    <div className={styles.admin_wrapper}>
                        <div className={styles.admin_header}>
                            <h2>{title}</h2>
                            <ProfileMenu />
                        </div>
                        <div className={styles.line}></div>
                        <div className={styles.admin_body}>
                            {children}
                        </div>
                    </div>
                    <AdminMenu />
                </div>
            </section>

        </Layout>

    )
}
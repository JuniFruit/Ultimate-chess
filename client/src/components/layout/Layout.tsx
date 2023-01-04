import { FC, PropsWithChildren } from "react";
import { setTabTitle } from "../../utils/general.utils";
import styles from './Layout.module.scss';
import Header from "./header/Header";
import { InfoPop } from "../ui/info-pop/InfoPop";


export const Layout: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => {
    setTabTitle(title);
    return (
        <main className={styles.main}>
            <div className={styles.page}>
                <Header />
                <div className={styles.wrapper}>
                    {children}
                </div>
                <InfoPop />
            </div>
        </main>
    )
}
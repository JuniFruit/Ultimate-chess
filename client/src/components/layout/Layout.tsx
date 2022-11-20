import { FC, PropsWithChildren } from "react";
import { setTabTitle } from "../../utils/general.utils";
import styles from './Layout.module.scss';
import Header from "./header/Header";


export const Layout: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => {
    setTabTitle(title);
    return (
        <main>
            <section>
                <Header />
                <div className={styles.wrapper}>
                    {children}
                </div>
            </section>

        </main>
    )
}
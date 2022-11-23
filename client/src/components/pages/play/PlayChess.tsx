import { FC } from "react";
import { Layout } from "../../layout/Layout";
import { menuData } from "./menu.data";
import Menu from "../home/main-menu/Menu";


const PlayChess: FC = () => {

    return (
        <Layout title="Play Chess">
            <Menu items={menuData} />

        </Layout>
    )
}

export default PlayChess;
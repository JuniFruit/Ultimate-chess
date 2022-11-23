import { FC } from "react";
import { Layout } from "../../layout/Layout";
import Menu from "./main-menu/Menu";
import { menuData } from "./main-menu/menu.data";



const Home: FC = () => {

    return (
        <Layout title="Ultimate Chess Home Page">
            <Menu items={menuData} />    

        </Layout>
    )
}

export default Home;
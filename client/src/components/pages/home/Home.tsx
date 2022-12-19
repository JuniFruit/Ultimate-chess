import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { Layout } from "../../layout/Layout";
import { menuData } from "./main-menu/menu.data";
import { IMenuData } from "./main-menu/Menu.interface";
import Menu from "./main-menu/MenuWrapper";



const Home: FC = () => {

    const { user } = useAuth();
    const navigate = useNavigate();

    const filteredData = menuData.filter(item => {
        if ((item.link === '/registration' && user) || (item.link === '/packs' && !user)) return false
        return true;
    })
    const handleClick = (item: IMenuData) => {
        navigate(item.link);
    } 

    return (
        <Layout title="Ultimate Chess Home Page">
            <Menu<IMenuData>
                onClick={handleClick}
                items={filteredData} />          

        </Layout>
    )
}

export default Home;
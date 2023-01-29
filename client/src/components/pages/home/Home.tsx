import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { setTabTitle } from "../../../utils/general.utils";
import { menuData } from "./main-menu/menu.data";
import { IMenuData } from "./main-menu/Menu.interface";
import Menu from "./main-menu/MenuWrapper";


const Home: FC = () => {

    const { user } = useAuth();
    const navigate = useNavigate();

    const filteredData = menuData.filter(item => {
        if ((item.link === '/registration' && user)) return false
        return true;
    })
    setTabTitle("Ultimate Chess Home Page");

    const handleClick = (item: IMenuData) => {
        navigate(item.link);
    }

    return (
        <Menu<IMenuData>
            onClick={handleClick}
            items={filteredData} />
    )
}

export default Home;
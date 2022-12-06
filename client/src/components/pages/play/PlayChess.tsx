import { FC } from "react";
import { Layout } from "../../layout/Layout";
import { randomize } from "../../../utils/general.utils";
import Menu from "../home/main-menu/MenuWrapper";
import { IMenuData } from "../home/main-menu/Menu.interface";
import { useNavigate } from "react-router-dom";
import { menuData } from "./menuData";


const PlayChess: FC = () => {

    const filteredData = menuData.map(item => {
        if (item.link.includes('/game-room')) item.link = item.link + `${randomize()}`;
        return item;
    })

    const navigate = useNavigate()

    const handleClick = (item: IMenuData) => {
        navigate(item.link);
    }

    return (
        <Layout title="Play Chess">
            <Menu<IMenuData>
                onClick={handleClick}
                items={filteredData} />

        </Layout>
    )
}

export default PlayChess;
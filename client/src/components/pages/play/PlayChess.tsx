import { FC } from "react";
import { Layout } from "../../layout/Layout";
import { randomize } from "../../../utils/general.utils";
import Menu from "../home/main-menu/MenuWrapper";
import { IMenuData } from "../home/main-menu/Menu.interface";
import { useNavigate } from "react-router-dom";
import { menuData } from "./menuData";


const PlayChess: FC<{ isUltimate?: boolean }> = ({ isUltimate = false }) => {

    const filteredData = menuData.map(item => {
        if (item.link.includes('/game-room')) item.link = item.link + `${randomize()}` + `${isUltimate ? '_ult' : ''}`;
        return item;
    })

    const navigate = useNavigate()

    const handleClick = (item: IMenuData) => {
        if (item.title === 'Back') return navigate(item.link);
        window.location.href = item.link;
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
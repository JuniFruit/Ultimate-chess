import { FC, useState } from "react";
import { Layout } from "../../layout/Layout";
import Menu from "../home/main-menu/Menu";
import { randomize } from "../../../utils/general.utils";


const PlayChess: FC = () => {

    const [menuData, setMenuData] = useState([{
        title: 'Play 5 min',
        link: `/game-room/${randomize()}_5min`
    },
    {
        title: 'Back',
        link: '/'
    }
    ])

    return (
        <Layout title="Play Chess">
            <Menu items={menuData} />

        </Layout>
    )
}

export default PlayChess;
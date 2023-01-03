import { FC, useState } from "react";
import { Layout } from "../../layout/Layout";
import { randomize } from "../../../utils/general.utils";
import Menu from "../home/main-menu/MenuWrapper";
import { IMenuData } from "../home/main-menu/Menu.interface";
import { useNavigate } from "react-router-dom";
import { menuData } from "./menuData";
import { TutorialComp } from "./tutorial/TutorialComp";


const PlayChess: FC<{ isUltimate?: boolean }> = ({ isUltimate = false }) => {

    const [isTutorialOpen, setIsTutorialOpen] = useState(false);

    const filteredData = menuData.filter(item => {
        if (item.link.includes('/game-room')) item.link = item.link + `${randomize()}` + `${isUltimate ? '_ult' : ''}`;
        if (isUltimate && item.title === 'Play 10 min') return false;     
        if (!isUltimate && item.title === 'Tutorial') return false;

        return true;
    })

   

    const navigate = useNavigate()

    const handleClick = (item: IMenuData) => {
        if (item.title === 'Tutorial') return setIsTutorialOpen(prev => true);
        if (item.title === 'Back') return navigate(item.link);
        window.location.href = item.link;
    }

    return (
        <Layout title="Play Chess">
            <Menu<IMenuData>
                onClick={handleClick}
                items={filteredData} />            
            {isTutorialOpen ? <TutorialComp onClose={() => setIsTutorialOpen(false)} /> : null}
        </Layout>
    )
}

export default PlayChess;
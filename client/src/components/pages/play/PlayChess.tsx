//@ts-nocheck
import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { randomize } from "../../../utils/general.utils";
import { Layout } from "../../layout/Layout";
import { IMenuData } from "../home/main-menu/Menu.interface";
import Menu from "../home/main-menu/MenuWrapper";
import { menuData } from "./menuData";
import { TutorialComp } from "./tutorial/TutorialComp";
const PlayChess: FC<{ isUltimate?: boolean }> = ({ isUltimate = false }) => {

    const [isTutorialOpen, setIsTutorialOpen] = useState(false);


    const mappedData = useMemo(() => menuData.map(item => {
        if (isUltimate && item.title === 'Play 10 min') return null;
        if (!isUltimate && item.title === 'Tutorial') return null;
        const itemCopy = { ...item }
        if (item.link.includes('/game-room')) itemCopy.link = item.link + `${randomize()}` + `${isUltimate ? '_ult' : ''}`;
        return itemCopy;
    }), [isUltimate])

    const filtered: IMenuData[] = useMemo(() => mappedData.filter(item => item !== null), [mappedData]);
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
                items={filtered} />
            {isTutorialOpen ? <TutorialComp onClose={() => setIsTutorialOpen(false)} /> : null}
        </Layout>
    )
}

export default PlayChess;
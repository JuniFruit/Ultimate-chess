import { randomize } from "../../../utils/general.utils";
import { IMenuData } from "../home/main-menu/Menu.interface";



export const menuData: IMenuData[] = [
    {
        title: 'Play 5 min',
        link: `/game-room/${randomize()}_5min`
    },
    {
        title: 'Back',
        link: '/'
    }
] 
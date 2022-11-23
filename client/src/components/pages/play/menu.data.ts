import { randomize } from "../../../utils/general.utils";
import { IMenuData } from "../home/main-menu/Menu.interface";



export const menuData: IMenuData[] = [
    {
        title: 'Play Online',
        link: `/game-room/${randomize()}`
    },
    {
        title: 'Back',
        link: '/'
    }
] 
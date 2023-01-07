import { mockups } from "../../../../assets/mockups/images";
import { splashes } from "../../../../assets/splashes/splash";
import { IMenuData } from "./Menu.interface";

export const menuData: IMenuData[] = [
    {
        title: 'Play Chess',
        link: '/play',
        preview: splashes.regularChessSplash,
    },
    {
        title: 'Play Ultimate Chess',
        link: '/play-ultimate',
        preview: splashes.ultimateSplash,
    },
    {
        title: 'Watch Chess',
        link: '/watch',
        preview: splashes.watchSplash,
    },
    {
        title: 'Settings',
        link: '/settings',
        preview: splashes.settingsSplash,
    },
    {
        title: 'Packs',
        link: '/packs',
        preview: splashes.packsSplash,
    },
    {
        title: 'Sign Up',
        link: '/registration',
        preview: splashes.signUpSplash,
    }
]
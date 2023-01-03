import { ITutorialItem } from "./tutorialData";


export interface ITutorialPage extends ITutorialItem {
    currentPage: number;
    pageTotal: number;
}

export interface ITutorialComp {
    onClose: () => void;
}
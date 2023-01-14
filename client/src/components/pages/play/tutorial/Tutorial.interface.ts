import { ITutorialItem } from "./tutorialData";


export interface ITutorialPage extends ITutorialItem {   
}

export interface ITutorialComp {
    onClose: () => void;
}
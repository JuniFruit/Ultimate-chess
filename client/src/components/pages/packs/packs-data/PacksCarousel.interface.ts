import { IPack } from "../../../../types/pack.interface";



export interface IPackMenu {
    packs: IPack[],
}

export interface IPackSlide {
    preview: string;
    onChoosePack: (packId: number) => void;
    packId: number;
    title: string
    isInUse: boolean;
}       
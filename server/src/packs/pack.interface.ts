import {ISpritesObj} from '../../../client/src/model/figures/Figures'

export interface IPackInfo {
    title: string;
    packPath: {
        id: number
    }
    sysName: string;
    preview: string;    
}

export interface ISpritePack extends ISpritesObj {}
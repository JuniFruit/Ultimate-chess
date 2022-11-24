import {ISpritesObj} from '../../../client/src/model/figures/Figures'

export interface IPackInfo {
    name: string;
    packPath: {
        id: number
    }
    sysName: string;
    preview: string;    
}

export interface ISpritePack extends ISpritesObj {}
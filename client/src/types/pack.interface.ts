import { ISpritesObj } from "../model/figures/Figures";
import { IUser } from "./user.interface";


export interface IPackPath extends ISpritesObj {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPack {
    id: number;
    packPath: IPackPath
    name: string;
    sysName: string;
    preview: string;
    owner: IUser[] | []
}
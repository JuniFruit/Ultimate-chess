import { ISpritesObj } from "../../../model/figures/figures.interface";
import { IPack } from "../../../types/pack.interface";
import { IUser } from "../../../types/user.interface";




export interface IPlayerInfo extends Pick<IUser, 'avatarLink' | 'id' | "winsCount" | "lossesCount" | "username"> {
    // username:string;
    // winsCount:number;
    // lossesCount:number;
    packInUse?: ISpritesObj;
}
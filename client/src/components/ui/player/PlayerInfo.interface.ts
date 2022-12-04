import { IUser } from "../../../types/user.interface";




export interface IPlayerInfo extends Pick<IUser, 'avatarLink' | 'id'> {
    username?:string,
    winsCount?:number,
    lossesCount?:number,
    
}
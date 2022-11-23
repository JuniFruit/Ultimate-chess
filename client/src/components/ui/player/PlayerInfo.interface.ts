import { IUser } from "../../../types/user.interface";




export interface IPlayerInfo extends Pick<IUser, 'avatarLink'> {
    username?:string,
    winsCount?:number,
    lossesCount?:number,
    
}
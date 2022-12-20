import { IUser } from "../../../../types/user.interface";



export interface IProfileHeader extends Pick<IUser, "avatarLink" | "lossesCount" | "winsCount" | "username" | "roles"> {
    
}
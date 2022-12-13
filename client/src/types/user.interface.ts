import { IPack } from "./pack.interface"
import { IRole } from "./role.interface";


export interface IUser {
    id: number;
    username: string
    avatarLink?: string
    packs: IPack[],
    packInUse: IPack,
    winsCount: number
    lossesCount: number
    roles: IRole[]
}
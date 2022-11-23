import { IPack } from "./pack.interface"


export interface IUser {
    username: string
    avatarLink?: string
    packs: IPack[],
    winsCount: number
    losesCount: number
}
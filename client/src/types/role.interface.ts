import { IUser } from "./user.interface"


export interface IRole {
    id: number;
    role: string
    description: string    
    owner: IUser[];
}
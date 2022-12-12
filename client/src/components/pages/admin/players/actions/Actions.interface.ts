import { IRole } from "../../../../../types/role.interface";


export interface IRoleAction {
    roleValue: string;
    userId: number;
}

export interface IDeleteRole {
    userId: number,
    roles: IRole[]
}
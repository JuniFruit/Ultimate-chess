import { axiosRequest } from "../api/axios";
import { IAuthDto, IRegisterDto, IUserFields } from "../types/auth.interface";


export const AUTH = 'auth';

export const AuthService = {
    async login(data: IAuthDto): Promise<IUserFields> {
        const response = await axiosRequest.post<IUserFields>(`${AUTH}/login`, {dto: data})
        return response.data
    },

    async register(data: IRegisterDto): Promise<IUserFields> {
        const response = await axiosRequest.post<IUserFields>(`${AUTH}/register`, {dto: data})
        return response.data
    }

}
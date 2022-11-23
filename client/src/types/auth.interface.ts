
export interface IAuthDto {
    username: string
    password: string
}



export interface IRegisterDto {
    username: string
    password: string
    avatarLink: string
}

export interface IUserFields {
    user: {
        id: number,
        username: string,
        accessToken: string
    } | null
}
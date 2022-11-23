import {IsString, MinLength, ValidateIf} from 'class-validator';

export class AuthDto {
    
    @IsString()
    username!: string

    @MinLength(6,{
        message: 'Cannot be less than 6 characters'
    })
    @IsString()
    password!: string
}


export class RegisterDto {
    @IsString()
    username!: string

    @MinLength(6,{
        message: 'Cannot be less than 6 characters'
    })
    @IsString()
    password!: string

    @ValidateIf(o => o.avatarLink !== undefined)
    @IsString()
    avatarLink!: string
}
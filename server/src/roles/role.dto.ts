import { IsString, IsUppercase, MinLength } from 'class-validator';

export class CreateRoleDto {

    @IsString()

    @MinLength(3, {
        message: 'Cannot be less than 3 characters'
    })
    @IsUppercase({
        message: 'Only uppper case'
    })
    role!: string

    @IsString()
    @MinLength(10, {
        message: 'Description cannot be that short'
    })
    description!: string;
}

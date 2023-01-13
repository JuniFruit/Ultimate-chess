import { IsNotEmpty, IsString } from 'class-validator';

export class UserEditDto {
    @IsString({message: 'Only string format is allowed'})
    @IsNotEmpty({message: 'Cannot be empty'})
    avatarLink!: string
}


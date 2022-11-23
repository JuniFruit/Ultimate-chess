import { AuthDto, RegisterDto } from "./auth.dto"
import { userRepository } from "../database/db.connect"
import { genSalt, hash, compare } from 'bcrypt'
import { UserEntity } from "../user/user.entity";
import JWT from 'jsonwebtoken';

export const AuthService = {

    async register(dto: RegisterDto) {

        const isRegistered = await userRepository.findOneBy({ username: dto.username });

        if (isRegistered) throw new Error('User already exists')

        const salt = await genSalt(10);
        const hashedPass = await hash(dto.password, salt);

        const newUser = new UserEntity();
        newUser.avatarLink = dto.avatarLink;
        newUser.password = hashedPass;
        newUser.username = dto.username;

        await userRepository.save(newUser);

        return {
            user: this.returnFields(newUser)
        }
    },

    async login(dto: AuthDto) {
        const user = await userRepository.findOne({
            where: {
                username: dto.username
            },
            select: ['id','username', 'password']
        });

        if (!user) throw new Error('User is not found');
        console.log(user);
        const isMatchingPass = await compare(dto.password, user.password);

        if (!isMatchingPass) throw new Error('Password is incorrect');

        return {
            user: this.returnFields(user)
        }
    },

    generateToken(user: UserEntity) {
        const accessToken = JWT.sign({
            id: user.id, username: user.username
        },
            process.env.JWT_SECRET!,
            {
                expiresIn: '24h'
            }
        )
        return accessToken;
    },

    returnFields(user: UserEntity) {
        const token = this.generateToken(user);

        return {
            id: user.id,
            username: user.username,
            accessToken: token
        }
    }



}
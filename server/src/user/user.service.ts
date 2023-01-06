import { Like } from "typeorm"
import { RegisterDto } from "../auth/auth.dto"
import { roleRepository, userRepository } from "../database/db.connect"

export const UserService = {
    async getById(id: number) {
        const user = await userRepository.findOne({
            where: {
                id: id
            },
            relations: {
                packs: true,
                packInUse: {
                    packPath: true
                },
                roles: true
            }
        })

        if (!user) throw new Error('User doesn\'t exist')
        return user
    },
    async update(id: number) {
        const user = await this.getById(id);

    },
    async increaseWins(id: number) {
        const user = await this.getById(id);
        user.winsCount++;
        return await userRepository.save(user);

    },

    async addRole(userId: number, roleValue: string) {
        const user = await this.getById(userId);

        if (!user) throw new Error('Such user doesn\'t exist');

        const role = await roleRepository.findOneBy({ role: roleValue });

        if (!role) throw new Error("Such role doesn\'t exist");
        const isInList = user.roles.find(userRole => userRole.role === roleValue);
        if (isInList) throw new Error("User already has this role");

        user.roles.push(role);
        return await userRepository.save(user);

    },

    async deleteRole(userId: number, roleValue: string) {
        const user = await this.getById(userId);
        if (!user) throw new Error('Such user doesn\'t exist');

        const role = await roleRepository.findOne({
            where: {
                role: roleValue
            }
        });

        if (!role) throw new Error("Such role doesn\'t exist");

        user.roles = user.roles.filter(userRole => userRole.id !== role.id);
        return await userRepository.save(user);
    },

    async increaseLoses(id: number) {
        const user = await this.getById(id);
        user.lossesCount++;
        return await userRepository.save(user);
    },
    async create(dto: RegisterDto) {

        const defaults = {
            ...dto,
            roles: [{
                id: 1
            }]
        }

        const newUser = await userRepository.create(defaults);

        return await userRepository.save(newUser);
    },
    async getAll() {
        const users = await userRepository.find({
            relations: {
                packInUse: true,
                packs: true,
                roles: true,
            },
            order: {
                createdAt: "DESC"
            }
        })

        return users
    },
    async getBySearchTerm(term: string = '') {
        const users = await userRepository.find({
            where: {
                username: Like(`%${term}%`)
            },
            relations: {
                packInUse: true,
                packs: true,
                roles: true,
            },
            order: {
                createdAt: "DESC"
            }
        })

        return users;
    }
}
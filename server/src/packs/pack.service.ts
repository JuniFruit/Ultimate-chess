import { IPackInfo, ISpritePack } from "./pack.interface";
import { packRepository, spriteRepository, userRepository } from '../database/db.connect'
import { UserService } from "../user/user.service";

export const PackService = {

    async create(data: IPackInfo) {

        const newPack = await packRepository.create(data);
        return await packRepository.save(newPack);
    },

    async delete(packId: number) {
        try {
            return await packRepository.delete({ id: packId });

        } catch (error: any) {
            throw new Error(error);
        }
    },

    async getPackById(packId: number) {
        const pack = await packRepository.findOne({
            where: {
                id: packId
            },
            relations: {
                owner: true,
                packPath: true
            }
        });
        return pack;
    },

    async getPacks() {
        const packs = await packRepository.find({
            relations: {
                owner: true,
                packPath: true
            }
        })
        return packs;
    },
    async createSpritePack(data: ISpritePack) {
        const newSpritePack = await spriteRepository.create(data);
        await spriteRepository.save(newSpritePack);
        return newSpritePack.id;
    },
    async setInUse(userId: number, packId: number) {
        const user = await UserService.getById(userId);
        const pack = await this.getPackById(packId);
        console.log(pack?.owner);
        if (!pack) throw new Error('Such resource doesn\'t exist')
        if (!user) throw new Error('User doesn\'t exist')

        user.packInUse = pack;
        user.packs.push(pack);
        pack.owner.push(user);

        await packRepository.save(pack);
        return await userRepository.save(user);
    }
}
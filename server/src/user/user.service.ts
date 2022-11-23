import { userRepository } from "../database/db.connect"



export const UserService = {
    async getById(id:number) {
        const user = await userRepository.findOne({
            where: {
                id: id
            },
            relations: {
                packs: true
            }
        })

        if (!user) throw new Error('User doesn\'t exist')
        return user
    },
    async update(id:number) {
        const user = await this.getById(id);

    },
    async increaseWins(id:number) {
        const user = await this.getById(id);
        user.winsCount++;
        return await userRepository.save(user);

    },
    async increaseLoses(id:number) {
        const user = await this.getById(id);
        user.losesCount++;
        return await userRepository.save(user);
    }
}
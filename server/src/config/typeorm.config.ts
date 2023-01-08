import * as dotenv from 'dotenv'
import { DataSourceOptions } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { PacksEntity } from '../packs/packs.entity';
import { SpriteEntity } from '../packs/sprite.entity';
import { RolesEntity } from '../roles/role.entity';

dotenv.config()

const isProduction = process.env.NODE_ENV === 'production';
console.log(process.env.NODE_ENV)

export const getConfigTypeOrm = (): DataSourceOptions => {

    const baseConfig = {
        type: "postgres",
        synchronize: true,
        logging: false,
        entities: [UserEntity, PacksEntity, SpriteEntity, RolesEntity]
    }
    if (!isProduction) {
        return {
            ...baseConfig,
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,

        } as DataSourceOptions
    }

    return {
        type: "postgres",
        url: process.env.DB_URL,
        synchronize: true,
        logging: false,
        entities: [UserEntity, PacksEntity, SpriteEntity, RolesEntity]
    }
}
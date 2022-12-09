import {DataSourceOptions} from 'typeorm';

import dotenv from 'dotenv';
import { UserEntity } from '../user/user.entity';
import { PacksEntity } from '../packs/packs.entity';
import {SpriteEntity} from '../packs/sprite.entity';
import { RolesEntity } from '../roles/role.entity';

dotenv.config();

export const getConfigTypeOrm = ():DataSourceOptions => {
    return {
        type: "postgres",
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: false,
        entities: [UserEntity, PacksEntity, SpriteEntity, RolesEntity]
    }
}
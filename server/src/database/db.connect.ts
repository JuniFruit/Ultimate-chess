import { getConfigTypeOrm } from '../config/typeorm.config';
import { DataSource } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { PacksEntity } from '../packs/packs.entity';
import { SpriteEntity } from '../packs/sprite.entity';
import { RolesEntity } from '../roles/role.entity';



const postgresDB = new DataSource(getConfigTypeOrm());

postgresDB.initialize()
    .then(() => {
        console.log('success');


    })
    .catch((e) => console.log(e));



export const userRepository = postgresDB.getRepository(UserEntity);
export const packRepository = postgresDB.getRepository(PacksEntity);
export const spriteRepository = postgresDB.getRepository(SpriteEntity);
export const roleRepository = postgresDB.getRepository(RolesEntity);
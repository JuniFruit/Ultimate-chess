import { getConfigTypeOrm } from '../config/typeorm.config';
import { DataSource } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { PacksEntity } from '../user/packs.entity';



const postgresDB = new DataSource(getConfigTypeOrm());

postgresDB.initialize()
    .then(() => {
        console.log('success');


    })
    .catch((e) => console.log(e));



export const userRepository = postgresDB.getRepository(UserEntity);
export const packRepository = postgresDB.getRepository(PacksEntity);
import { BaseEntity } from "../utils/base";
import {Entity, Column, ManyToMany} from 'typeorm';
import { UserEntity } from "./user.entity";


@Entity({name: 'Packs'})
export class PacksEntity extends BaseEntity {

    @Column({default: '', name: 'pack_path'})
    packPath!: string

    @ManyToMany(() => UserEntity, user => user.packs)
    owner!: UserEntity[]
}
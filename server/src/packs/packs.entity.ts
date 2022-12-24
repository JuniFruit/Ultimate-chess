import { BaseEntity } from "../utils/base";
import {Entity, Column, ManyToMany, OneToOne, JoinColumn} from 'typeorm';
import { UserEntity } from "../user/user.entity";
import { SpriteEntity } from "./sprite.entity";


@Entity({name: 'Packs'})
export class PacksEntity extends BaseEntity {

    @OneToOne(() => SpriteEntity, sprite => sprite.owned, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({name: 'pack_path'})
    packPath!: SpriteEntity;

    @Column({default: ''})
    preview!: string;

    @Column({default: ''})
    title!:string;

    @Column({name: 'sys_name', default: 'undefined'})
    sysName!: string;

    @ManyToMany(() => UserEntity, user => user.packs, {onDelete: 'RESTRICT'})
    owner!: UserEntity[]
}
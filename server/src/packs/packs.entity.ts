import { BaseEntity } from "../utils/base";
import {Entity, Column, ManyToMany, OneToOne, JoinColumn} from 'typeorm';
import { UserEntity } from "../user/user.entity";
import { SpriteEntity } from "./sprite.entity";


@Entity({name: 'Packs'})
export class PacksEntity extends BaseEntity {

    @OneToOne(() => SpriteEntity, sprite => sprite.id, {onDelete: 'CASCADE'})
    @JoinColumn()
    packPath!: SpriteEntity;

    @Column({default: ''})
    preview!: string;

    @Column()
    title!:string;

    @Column({name: 'sys_name'})
    sysName!: string;

    @ManyToMany(() => UserEntity, user => user.packs)
    owner!: UserEntity[]
}
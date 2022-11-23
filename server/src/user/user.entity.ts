import { BaseEntity } from "../utils/base";
import { Entity, Column, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { PacksEntity } from "./packs.entity";


@Entity({name: 'User'})
export class UserEntity extends BaseEntity {
    
    @Column({nullable: false, unique: true})
    username!: string

    @Column({nullable: false, select: false})
    password!: string

    @Column({default: '', name: 'avatar_link'})
    avatarLink!: string

    @ManyToMany(() => PacksEntity, pack => pack.owner)
    @JoinTable()
    packs!: PacksEntity[]

    @Column({default: 0, name: 'wins_count'})
    winsCount!: number

    @Column({default:0, name: 'losses_count'})
    losesCount!: number

}
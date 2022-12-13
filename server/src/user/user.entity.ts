import { BaseEntity } from "../utils/base";
import { Entity, Column, ManyToMany, JoinColumn, JoinTable, ManyToOne } from 'typeorm';
import { PacksEntity } from "../packs/packs.entity";
import { RolesEntity } from '../roles/role.entity';

@Entity({ name: 'User' })
export class UserEntity extends BaseEntity {

    @Column({ nullable: false, unique: true })
    username!: string

    @Column({ nullable: false, select: false })
    password!: string

    @Column({ default: '', name: 'avatar_link' })
    avatarLink!: string

    @ManyToOne(() => PacksEntity)
    @JoinColumn({ name: 'pack_in_use' })
    packInUse!: PacksEntity

    @ManyToMany(() => PacksEntity, pack => pack.owner)
    @JoinTable()
    packs!: PacksEntity[]

    @ManyToMany(() => RolesEntity, role => role.owner )
    @JoinTable()
    roles!: RolesEntity[]

    @Column({ default: 0, name: 'wins_count' })
    winsCount!: number

    @Column({ default: 0, name: 'losses_count' })
    lossesCount!: number

}
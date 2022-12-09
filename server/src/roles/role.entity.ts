import { BaseEntity } from "../utils/base";
import {Entity, Column, ManyToMany, OneToOne, JoinColumn} from 'typeorm';
import { UserEntity } from "../user/user.entity";


@Entity({name: 'Roles'})
export class RolesEntity extends BaseEntity {

    @Column({unique: true})
    role!: string

    @Column({default: 'user role'})
    description!: string

    @ManyToMany(() => UserEntity, user => user.roles)
    owner!: UserEntity[]
}
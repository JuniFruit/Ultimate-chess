import { CreateRoleDto } from "./role.dto";
import {roleRepository} from '../database/db.connect';
import { FindOptionsWhereProperty } from "typeorm";
import { RolesEntity } from "./role.entity";

export const RoleService = {

    async createRole(dto: CreateRoleDto) {
        const role = await roleRepository.create(dto);

        return await roleRepository.save(role);
    },

    async deleteRole(roleValue:string) {
        await roleRepository.delete({role: roleValue});
    },

    async getRole(value?:string) {
        let options: FindOptionsWhereProperty<RolesEntity> = {};

        if (value) {
            options = {
                role: value
            }
        }

        const role = await roleRepository.find({
            where: {
                ...options
            },
            relations: {
                owner: true,
                
            }
        })

        return role
    }
}
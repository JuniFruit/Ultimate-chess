import { CreateRoleDto } from "./role.dto";
import {roleRepository} from '../database/db.connect';

export const RoleService = {

    async createRole(dto: CreateRoleDto) {
        const role = await roleRepository.create(dto);

        return await roleRepository.save(role);
    },

    async deleteRole(roleValue:string) {
        await roleRepository.delete({role: roleValue});
    },

    async getRoleByName(value:string) {
        const role = await roleRepository.findOneBy({
            role: value
        })

        return role
    }
}
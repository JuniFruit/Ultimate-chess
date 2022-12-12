import { IPackForm, IPackUpdateForm, ISpriteForm } from "../../components/pages/admin/packs/add-pack/pack-forms/Forms.interface";
import { IPack } from "../../types/pack.interface";
import { IRole } from "../../types/role.interface";
import { IUser } from "../../types/user.interface";
import { api } from "./api";

export const ROLE = 'roles'


export const roleApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRolesByValue: builder.query<IRole[], string>({
            query: (role) => ({
                url: `/${ROLE}/all`,
                params: {
                    value: role
                }
            }),
            providesTags: (result, error, arg) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Roles' as const, id })), 'Roles']
                    : ['Roles']
        }),
        getRoles: builder.query<IRole[], null>({
            query: () => ({
                url: `/${ROLE}/all`                
            }),
            providesTags: (result, error, arg) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Roles' as const, id })), 'Roles']
                    : ['Roles']
        })
       

    })
})
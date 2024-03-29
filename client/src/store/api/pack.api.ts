import { IPackForm, IPackUpdateForm, ISpriteForm } from "../../components/pages/admin/packs/add-pack/pack-forms/Forms.interface";
import { ISpritesObj } from "../../model/figures/figures.interface";
import { IPack } from "../../types/pack.interface";
import { IUser } from "../../types/user.interface";
import { api } from "./api";

export const PACK = 'packs'


export const packApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPacks: builder.query<IPack[], null>({
            query: () => `/${PACK}/all`,
            providesTags: (result, error, arg) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Packs' as const, id })), 'Packs']
                    : ['Packs']
        }),
        getPackById: builder.query<IPack, number>({
            query: (id) => ({
                url: `/${PACK}/by-id/${id}`

            }),
            providesTags: (res, err, id) => [{ type: 'Packs', id }]
        }),
        getSpritePackById: builder.query<ISpritesObj, number>({
            query: (id) => ({
                url: `/${PACK}/sprite/by-id/${id}`,
                method: "GET"
            })
        }),
        addPackToProfile: builder.mutation<IUser, number>({
            query: (id) => ({
                url: `/${PACK}/add`,
                method: "POST",
                body: {
                    id: id
                }
            }),
            invalidatesTags: (result, err, id) => [{ type: 'Profile' }, { type: "Users", id: result?.id }]
        }),
        createSpritePack: builder.mutation<{ id: number }, ISpriteForm>({
            query: (data) => ({
                url: `/${PACK}/sprite/create`,
                method: "POST",
                body: {
                    ...data
                }
            })
        }),
        updateSpritePack: builder.mutation<ISpritesObj, ISpriteForm>({
            query: (data) => ({
                url: `/${PACK}/sprite/update/${data.id}`,
                method: "PUT",
                body: {
                    ...data
                }
            })
        }),

        createPack: builder.mutation<IPack, IPackForm>({
            query: (data) => ({
                url: `/${PACK}/create`,
                method: "POST",
                body: {
                    ...data
                }
            }),
            invalidatesTags: (res, err, id) => [{ type: "Packs" }]
        }),
        updatePack: builder.mutation<IPack, IPackUpdateForm>({
            query: (data) => ({
                url: `/${PACK}/update/${data.id}`,
                method: "PUT",
                body: {

                    ...data

                }
            }),
            invalidatesTags: (res, err, data) => [{ type: "Packs", id: data.id }]
        }),
        deletePack: builder.mutation<null, number>({
            query: (id) => ({
                url: `/${PACK}/delete`,
                method: "DELETE",
                body: {
                    id
                }
            }),
            invalidatesTags: (res, err, id) => [{ type: "Packs", id }, { type: "Profile" }]
        })

    })
})
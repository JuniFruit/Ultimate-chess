import { url } from "inspector";
import { IPack } from "../../types/pack.interface";
import { IUser } from "../../types/user.interface";
import { api } from "./api";

export const PACK = 'packs'


export const packApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPacks: builder.query<IPack[], null>({
            query: () => `/${PACK}/all`,
            providesTags: [{ type: 'Packs' }]
        }),
        addPackToProfile: builder.mutation<IUser, number>({
            query: (id) => ({
                url: `/${PACK}/add`,
                method: "POST",
                body: {
                    id: id
                }
            }),
            invalidatesTags: (result, err, id) => [{type: 'Profile'}]
        })

    })
})
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../api/axios'
import { IRoleAction } from '../../components/pages/admin/players/actions/Actions.interface';
import { USER } from '../../services/user.service';
import { IUser } from '../../types/user.interface';
import { TypeRootState } from '../store';

export const api = createApi({
    tagTypes: ['Profile', 'Users', 'Packs', 'Roles'],
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as TypeRootState).auth.user?.accessToken;

            if (token) headers.set('Authorization', `Bearer ${token}`);

            return headers;
        }
    }),
    endpoints: builder => ({
        getProfile: builder.query<IUser, null>({
            query: () => `${USER}/profile`,
            providesTags: [{ type: 'Profile' }]
        }),
        increaseWins: builder.mutation<IUser, null>({
            query: () => ({
                url: `${USER}/increase-wins`,
                method: "PUT"
            }),
            invalidatesTags: () => [{ type: 'Profile' }]
        }),
        increaseLosses: builder.mutation<IUser, null>({
            query: () => ({
                url: `${USER}/increase-losses`,
                method: "PUT"
            }),
            invalidatesTags: () => [{ type: 'Profile' }]
        }),
        getById: builder.query<IUser, string>({
            query: (id) => `${USER}/by-id/${id}`,
            providesTags: (result, error, id) => [{ type: 'Users', id: id }]
        }),
        getAll: builder.query<IUser[], null>({
            query: () => `/${USER}/all`,
            providesTags: (result, error, arg) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Users' as const, id })), 'Users']
                    : ['Users']
        }),
        getBySearchTerm: builder.query<IUser[], string>({
            query: (searchTerm) => ({
                url: `/${USER}/by-term`,
                params: {
                    term: searchTerm
                }
            }),
            providesTags: (result, error, arg) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Users' as const, id })), 'Users']
                    : ['Users']
        }),
        addRoleToUser: builder.mutation<IUser,IRoleAction>({
            query: (data) => ({
                url: `/${USER}/add-role`,
                method: "PUT",
                body: {
                    ...data
                }
            }),
            invalidatesTags: (res, err, data) => [{type: "Users", id: data.userId}]
        }),
        deleteRoleFromUser: builder.mutation<IUser,IRoleAction>({
            query: (data) => ({
                url: `/${USER}/delete-role`,
                method: "PUT",
                body: {
                    ...data
                }
            }),
            invalidatesTags: (res, err, data) => [{type: "Users", id: data.userId}]
        })

    })
})
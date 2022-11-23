import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../../api/axios'
import { USER } from '../../services/user.service';
import { IUser } from '../../types/user.interface';
import { TypeRootState } from '../store';

export const api = createApi({
    tagTypes: ['Profile', 'User'],
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
            providesTags: [{type: 'Profile'}]
        }),
        increaseWins: builder.mutation<IUser, null>({
            query: () => ({
                url: `${USER}/increase-wins`,
                method: "PUT"
            }),
            invalidatesTags: () => [{type: 'Profile'}]
        }),
        increaseLosses: builder.mutation<IUser, null>({
            query: () => ({
                url: `${USER}/increase-losses`,
                method: "PUT"
            }),
            invalidatesTags: () => [{type: 'Profile'}]
        }),
        getById: builder.query<IUser, string>({
            query: (id) => `${USER}/by-id/${id}`,
            providesTags: (result, error, id) => [{type: 'User', id: id}]
        })

    })
})
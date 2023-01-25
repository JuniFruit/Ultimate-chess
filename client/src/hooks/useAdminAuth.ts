import { useNavigate } from "react-router-dom"
import { useEffect } from 'react';
import { useAuth } from "./useAuth"
import { api } from "../store/api/api"


export const useAdminAuth = () => {

    const { user } = useAuth()
    const navigate = useNavigate();
    const { data: profile } = api.useGetProfileQuery(null, {
        skip: !user
    })
   

    useEffect(() => {
        if (!user) return navigate('/');
        const isAdmin = profile?.roles.some(item => item.role === 'ADMIN' || item.role === "CREATOR" || item.role === "SHOWCASE");
        if (!isAdmin) return navigate('/');

    }, [user, profile])

    return true;
}
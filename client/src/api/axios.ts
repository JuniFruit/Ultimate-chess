import axios from "axios"

// export const BASE_URL = '/'
export const BASE_URL = 'http://192.168.1.101:3001/'

export const axiosRequest = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },


})

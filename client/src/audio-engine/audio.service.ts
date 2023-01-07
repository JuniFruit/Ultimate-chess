import { axiosRequest } from "../api/axios"


export const AudioService = {
    async fetchAudio(url: string) {


        const res = await axiosRequest.get(url, {
            baseURL: '/',
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }

        })
        return res.data;
    }
}
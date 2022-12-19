import { axiosRequest } from "../api/axios"


export const AudioService = {
    async fetchAudio(url: string) {

        // const response = await fetch(url, {
            
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'Access-Control-Allow-Origin': '*'
        //     },
        //     credentials: 'include'
        // });
        // const data = await response.arrayBuffer();
        
        const res = await axiosRequest.get(url, {
            baseURL: '',
            responseType: 'arraybuffer',
            headers: {
                // 'Content-Type': 'application/x-www-form-urlencoded'
            },
          
            
        })

        return res.data;
    }
}
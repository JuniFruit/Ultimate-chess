import io, { Socket } from 'socket.io-client';
import { IOClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IOServerEvents } from '../constants/socketIO/ServerEvents.interface';

const URL = 'http://localhost:3001';

const tokenDecoder = () => {

    if (!window.localStorage['persist:root']) return '';
    const root = JSON.parse(window.localStorage['persist:root']).auth;
    
    
    return JSON.parse(root).user?.accessToken
}
 
const ioClient: Socket<IOServerEvents, IOClientEvents> = io(URL, {
    auth: {
        token: tokenDecoder()
    }
});

export default ioClient;
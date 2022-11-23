import io, { Socket } from 'socket.io-client';
import { IOClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IOServerEvents } from '../constants/socketIO/ServerEvents.interface';

const URL = 'http://localhost:3001';


 
const ioClient: Socket<IOServerEvents, IOClientEvents> = io(URL, {
    auth: {
        token: "1"
    }
});

export default ioClient;
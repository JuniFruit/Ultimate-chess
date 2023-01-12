import io, { Socket } from 'socket.io-client';
import { IOClientEvents } from '../constants/socketIO/ClientEvents.interface';
import { IOServerEvents } from '../constants/socketIO/ServerEvents.interface';
import { getHandshakeAuth } from '../utils/socket.api.utils';

const URL = 'http://192.168.1.102:3001';
// const URL = '/';




const ioClient: Socket<IOServerEvents, IOClientEvents> = io(URL, {
    auth: getHandshakeAuth(),
    autoConnect: false,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000,
});





export default ioClient;
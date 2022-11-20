import io from 'socket.io-client';
const URL = 'http://localhost:3001';


const ioClient = io(URL);

export default ioClient;
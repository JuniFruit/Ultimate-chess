import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getWSconfig } from './config/socketIo.config';
import { roomListener } from './listeners/listeners';
dotenv.config();

const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
const httpServer = createServer(app);
const ioServer = new Server(httpServer, getWSconfig());

const mainAdapter = ioServer.of('/').adapter

ioServer.on('connection', (socket) => {
    console.log(`New connection ${socket.id}`);
    roomListener(socket, mainAdapter);

})


httpServer.listen(port, () => {
    console.log('Server is online');
})
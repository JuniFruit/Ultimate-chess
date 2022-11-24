import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getWSconfig } from './config/socketIo.config';
import { gameListener, roomListener } from './listeners/listeners';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import packRouter from './routes/packs.route';
import bodyParser from 'body-parser';
import {IClientEvents} from './constants/socketIO/ClientEvents.interface'
import {IServerEvents} from './constants/socketIO/ServerEvents.interface'
import {userHandler} from './middleware/userHandler.middleware';
dotenv.config();

const port = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/packs', packRouter);

const httpServer = createServer(app);
const ioServer = new Server<IClientEvents,IServerEvents>(httpServer, getWSconfig());


ioServer.use(userHandler)

const mainAdapter = ioServer.of('/').adapter



ioServer.on('connection', (socket) => {
    console.log(`New connection ${socket.id}`);
    roomListener(socket, mainAdapter);
    gameListener(socket, mainAdapter);

})


httpServer.listen(port, () => {
    console.log('Server is online');
})
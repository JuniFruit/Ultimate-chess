import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path'
import { createServer } from 'http';
import { Server } from 'socket.io';
import { getWSconfig } from './config/socketIo.config';
import { chatListener, gameListener, roomListener, serverListener } from './listeners/listeners';
import authRouter from './routes/auth.route';
import userRouter from './routes/user.route';
import packRouter from './routes/packs.route';
import roleRouter from './routes/role.route';
import bodyParser from 'body-parser';
import { IClientEvents } from './constants/socketIO/ClientEvents.interface'
import { IServerEvents } from './constants/socketIO/ServerEvents.interface'
import { userHandler } from './middleware/userHandler.middleware';

dotenv.config()

const port = process.env.PORT || 3001;

const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/packs', packRouter);
app.use('/roles', roleRouter)

const httpServer = createServer(app);
const ioServer = new Server<IClientEvents, IServerEvents>(httpServer, getWSconfig());


ioServer.use(userHandler)



ioServer.on('connection', (socket) => {

    serverListener(socket, ioServer);
    roomListener(socket, ioServer);
    chatListener(socket);
    gameListener(socket, ioServer);

})

app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "../../client/build", "index.html"));
});


httpServer.listen(port, () => {
    console.log('Server is online at port ' + port);
})
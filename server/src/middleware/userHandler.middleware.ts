import { NextFunction } from "express";
import { Socket } from "socket.io";
import { UserService } from "../user/user.service";


export const userHandler = async(socket: Socket, next:any) => {
    try {
        const user = await UserService.getById(socket.handshake.auth.token)
        socket.data.user = user;
        next();
    } catch (error) {
        socket.data.user = {            
            username: `Guest_${Math.floor(Math.random() * 10000)}`,            
        }
        next()
    }
   
} 
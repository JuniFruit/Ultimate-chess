import { Socket } from "socket.io";
import { UserService } from "../user/user.service";
import jwt from 'jsonwebtoken';


export const userHandler = async(socket: Socket, next:any) => {
    try {
        console.log(socket.handshake.auth.token);
        let userId: number = 0;
        jwt.verify(
            socket.handshake.auth.token,
            process.env.JWT_SECRET!,
            (err:any, decoded:any) => {
                userId = decoded.id;
            }
        )
        const user = await UserService.getById(userId)
        socket.data.user = user;
        next();
    } catch (error) {
        socket.data.user = {            
            username: `Guest_${Math.floor(Math.random() * 10000)}`,          
            winsCount: 0,
            losesCount: 0  
        }
        next()
    }
   
} 
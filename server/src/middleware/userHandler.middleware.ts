import { Socket } from "socket.io";
import { UserService } from "../user/user.service";
import jwt from 'jsonwebtoken';
import { IPlayerInfo } from "../../../client/src/components/ui/player/PlayerInfo.interface";
import { IUser } from "../../../client/src/types/user.interface";


export const userHandler = async(socket: Socket, next:any) => {
    try {
        const auth = socket.handshake.auth;

        if (auth.guestName) {
            (socket.data.user as IPlayerInfo | IUser) = {            
                username: auth.guestName,  
                id: 0,        
                winsCount: 0,
                lossesCount: 0  
            }
            return next();
        }

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
       console.log(error);
    }
   
} 
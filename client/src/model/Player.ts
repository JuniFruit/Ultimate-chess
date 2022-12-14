import { IPlayerInfo } from "../components/ui/player/PlayerInfo.interface";
import { IUser } from "../types/user.interface";
import { Colors } from "./colors.enum";


export interface IPlayer {
    username: string,
    user: IPlayerInfo,  
    color: Colors,
 
}


export class Player implements IPlayer {
    username;
    color;
    user;


    constructor(username:string, color: Colors, user: IPlayerInfo) {
        this.username = username;
        this.color = color;  
        this.user = user;      
    }
}
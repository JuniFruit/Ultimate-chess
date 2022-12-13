import { IPlayerInfo } from "../components/ui/player/PlayerInfo.interface";
import { IUser } from "../types/user.interface";
import { Colors } from "./colors.enum";


export interface IPlayer {
    username: string,
    user: IUser | IPlayerInfo,
    opponent: IUser | IPlayerInfo;
    color: Colors,
    score: number,
}


export class Player implements IPlayer {
    username;
    color;
    score;
    user;
    opponent;

    constructor(username:string, color: Colors, score:number, user:IUser | IPlayerInfo, opponent:IUser | IPlayerInfo) {
        this.username = username;
        this.color = color;
        this.score = score;
        this.user = user;
        this.opponent = opponent;
    }
}
import { Colors } from "./colors.enum";


export interface IPlayer {
    username: string,
    color: Colors,
    score: number,
}


export class Player implements IPlayer {
    username;
    color;
    score;

    constructor(username:string, color: Colors, score:number) {
        this.username = username
        this.color = color
        this.score = score
    }
}
import {Column, Entity} from 'typeorm';
import { BaseEntity } from '../utils/base';

@Entity({name: 'Sprite'})
export class SpriteEntity extends BaseEntity {
    @Column({name: 'black_bishop'})
    blackBishop!: string;
    @Column({name: 'white_bishop'})
    whiteBishop!: string;
    @Column({name: 'black_king'})
    blackKing!: string;
    @Column({name: 'white_king'})
    whiteKing!: string;
    @Column({name: 'black_pawn'})
    blackPawn!: string;
    @Column({name: 'white_pawn'})
    whitePawn!: string;
    @Column({name: 'black_queen'})
    blackQueen!: string;
    @Column({name: 'white_queen'})
    whiteQueen!: string;
    @Column({name: 'black_rook'})
    blackRook!: string;
    @Column({name: 'white_rook'})
    whiteRook!: string;
    @Column({name: 'black_knight'})
    blackKnight!: string;
    @Column({name: 'white_knight'})
    whiteKnight!: string;
}


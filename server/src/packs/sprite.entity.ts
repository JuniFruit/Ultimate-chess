import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from '../utils/base';
import { PacksEntity } from './packs.entity';

@Entity({name: 'Sprite'})
export class SpriteEntity extends BaseEntity {
    @OneToOne(() => PacksEntity, pack => pack.packPath, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    owned!: PacksEntity;
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
    @Column({default: 1})
    frames!: number;
}


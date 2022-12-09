
import { HTMLAttributes } from 'react';
export interface IPiece extends HTMLAttributes<HTMLDivElement> {
    sprite: string
    x?: number;
    y?: number;
    isDraggedOver: boolean;
}
import { IBoard } from "../../../../../model/Board";
import { ICellWrapper } from "../cells/Cell.interface";
import {CanvasHTMLAttributes} from 'react';

export interface ICanvasField extends CanvasHTMLAttributes<HTMLCanvasElement> {
    props: ICellWrapper;
}


import { Cell, ICell } from "../Cell";


export interface ICellUltStates {
    isPoisoned: boolean
}

export interface ICellUlt extends ICell {
    states: ICellUltStates

}

export class CellUlt extends Cell implements ICellUlt {
    states: ICellUltStates = {
        isPoisoned: false
    }
}
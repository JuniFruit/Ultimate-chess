import { useCallback, useState } from "react";
import { effectList } from "../../../../model/effects/data/effects.data";
import { IVFX } from "../../../../model/effects/VFX";
import { IBoardUlt } from "../../../../model/ultimate/BoardUlt"
import { ICellUlt } from "../../../../model/ultimate/CellUlt";


export interface IUseVFX {
    board: IBoardUlt;
    isUltimate: boolean
}

export interface IVFXArrayItem {
    vfx: IVFX;
    posX: number;
    posY: number;
}

export const useVFX = ({board, isUltimate}: IUseVFX) => {

    const [vfx, setVfx] = useState([])

    const setVfxFromCells = useCallback(() => {

        const result = [];

        

    }, [board.states.globalMovesCount])
}
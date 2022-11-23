import { Dispatch, FC, memo, SetStateAction, useEffect, useState } from "react"
import { IBoard } from "../../../../model/Board";
import { ICell } from "../../../../model/Cell";
import { Cell } from "./Cell";
import styles from './Field.module.scss';

export interface IField {
    board: IBoard;
    setBoard: Dispatch<SetStateAction<IBoard>>
}

export const Field: FC<IField> = ({ board, setBoard }) => {

    const [selectedCell, setSelectedCell] = useState<ICell | null>(null);
    

    
    useEffect(() => {        
        showAvailableMoves();
    }, [selectedCell])
    
    const showAvailableMoves = () => {
        if (!selectedCell) return;
        
        board.showAvailable(selectedCell);
        setBoard(board);
    }
    
    const handleSelect = (cell: ICell) => {
       
        if (selectedCell) {
            if (selectedCell !== cell) {
                selectedCell.moveFigure(cell);
                setSelectedCell(null);
                
                return;
            } else if (selectedCell === cell){
                return setSelectedCell(null);
            } else if (selectedCell !== cell && cell.figure) return setSelectedCell(cell);
        } else {
            if (!cell.figure) return;
            setSelectedCell(cell);            

        }      

    }


    return (
        <div className={styles.field}>
            {
                board.cells.map(row => {
                    return row.map((cell: ICell, index) => (
                        <Cell
                            color={cell.color}
                            figure={cell.figure}
                            cell={cell}
                            onSelect={handleSelect}    
                            selected={selectedCell}     
                            isAvailable={cell.isAvailable}                 
                            key={index}
                        />
                    ))
                })
            }
        </div>
    )
}
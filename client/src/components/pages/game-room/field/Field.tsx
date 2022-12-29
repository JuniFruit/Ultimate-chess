import { FC } from 'react';
import { Colors } from '../../../../model/colors.enum';
import { IBoardUlt } from '../../../../model/ultimate/BoardUlt';
import PromotionWindow from '../../../ui/piece/promotion/PromotionWindow';
import { SkillBook } from '../skill-book/SkillBook';
import CanvasField from './canvas/CanvasField';
import { IField } from "./Field.interface";
import styles from './Field.module.scss';
import { useField } from './useField';
import { useUltimate } from './useUltimate';



export const GameField: FC<IField> = (props) => {

    const { handlers, status } = useField({ ...props })

    const { ultHandlers, ultStatus } = useUltimate(
        {
            board: props.board as IBoardUlt,
            setBoard: props.setBoard,
            myColor: props.myColor,
            setIsSkillBookOpen: props.setIsSkillBookOpen,
            isObserver: props.isObserver,
            handleSendMove: handlers.handleSendMove
        }
    )


    return (
        <div className={styles.field}>
            <CanvasField
                cells={props.board.cells}
                isFlipped={props.myColor === Colors.BLACK}
                onCellSelect={handlers.handleSelect}
                selected={status.selectedCell}
                premoves={status.premoves}
                board={props.board}
                isUltimate={props.isUltimate}
                ultimateStates={
                    {
                        onSkillTargetSelect: ultHandlers.handlePerformSkill,
                        isUltimate: props.isUltimate,
                        isSkillTargetSelecting: ultStatus.isSkillTargetSelecting
                    }
                }
            />

            {status.isPromotion && <PromotionWindow handlePromotion={handlers.handlePromotion} />}
            {props.isSkillBookOpen &&
                <SkillBook
                    onChooseSkill={ultHandlers.handleSetChosenSkill}
                    onClose={() => props.setIsSkillBookOpen(prev => false)}
                    board={props.board as IBoardUlt}
                    myColor={props.myColor}
                />
            }
        </div>
    )
}
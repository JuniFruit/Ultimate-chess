import { FC, Suspense, useEffect } from 'react';
import { Colors } from '../../../../model/colors.enum';
import { IBoardUlt } from '../../../../model/ultimate/BoardUlt';
import { IField } from "./Field.interface";
import { useField } from './useField';
import { useIOField } from './useIOField';
import { useUltimate } from './useUltimate';
import { useVFX } from './useVFX';
import CanvasField from './canvas/CanvasField';
import PromotionWindow from '../../../ui/piece/promotion/PromotionWindow';
import styles from './Field.module.scss';

let SkillBook: FC<any>;


const GameField: FC<IField> = (props) => {


   
    const { handleSendMove } = useIOField({ ...props });
    const { handlers, status } = useField({ ...props, handleSendMove })
    const { ultHandlers, ultStatus } = useUltimate(
        {
            board: props.board as IBoardUlt,
            myColor: props.myColor,
            setIsSkillBookOpen: props.setIsSkillBookOpen,
            isObserver: props.isObserver,
            handleSendMove: handlers.handleSendMove,
        }
    )
   

    const { vfx } = useVFX({
        board: props.board as IBoardUlt,
        isUltimate: props.isUltimate,
        isFlipped: props.myColor === Colors.BLACK
    });

    useEffect(() => {
        if (!props.isUltimate || props.isObserver) return;
        const deferSkillBook = async () => {
            const book = await import('../skill-book/SkillBook')
            SkillBook = book.default
        }
        deferSkillBook()
    }, [props.isUltimate, props.isObserver])


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
                vfx={vfx}
                ultimateStates={
                    {
                        onSkillTargetSelect: ultHandlers.handlePerformSkill,
                        isUltimate: props.isUltimate,
                        isSkillTargetSelecting: ultStatus.isSkillTargetSelecting
                    }
                }
            />

            {status.isPromotion && <PromotionWindow handlePromotion={handlers.handlePromotion} />}
            <Suspense fallback={null}>
                {props.isSkillBookOpen && SkillBook
                    ?
                    <SkillBook
                        onChooseSkill={ultHandlers.handleSetChosenSkill}
                        onClose={() => props.setIsSkillBookOpen(prev => false)}
                        board={props.board as IBoardUlt}
                        myColor={props.myColor}
                    />
                    : null
                }
            </Suspense>
        </div>
    )
}

export default GameField;
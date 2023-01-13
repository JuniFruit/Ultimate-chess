import { FC, useCallback } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { useIsMobile } from "../../../../hooks/useMobile";
import { ISkillItem, SkillList } from "../../../../model/ultimate/Skills";
import { Book } from "../../../ui/book/Book";
import { Button } from "../../../ui/button/Button";
import { Portal } from "../../../ui/portal/Portal";
import { ISkillBook } from "./SkillBook.interface";
import { SkillPage } from "./SkillPage";


export const SkillBook: FC<ISkillBook> = ({ onChooseSkill, onClose, board, myColor }) => {

    const { isLaptopSmall } = useIsMobile();

    const getPages = useCallback((): JSX.Element[] => {
        const pages: ISkillItem[][] = []
        const skillsOnPage = isLaptopSmall ? 1 : 4;
        let temp: ISkillItem[] = [];

        SkillList.forEach((item, ind) => {
            if (ind % skillsOnPage === 0 && ind !== 0) {
                pages.push(temp)
                temp = []
            }
            if (!item.canBeUsedByPlayer) return           
            temp.push(item)
        })
        pages.push(temp);
        return pages.map((item, ind) => {
            return <SkillPage
                skills={item}
                onChooseSkill={onChooseSkill}
                board={board}
                myColor={myColor}
                key={ind} />
        })

    }, [board.states.skillsUsed.length, myColor])
    return (
        <Portal>
            <Book pages={getPages()}>
                <Button onClick={onClose} title={'Close the book'}>
                    <IoCloseCircle />
                </Button>
            </Book>
        </Portal>
    )
}
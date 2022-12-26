import { FC, useCallback } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { ISkillItem, SkillList } from "../../../../model/ultimate/Skills";
import { Book } from "../../../ui/book/Book";
import { Button } from "../../../ui/button/Button";
import { ISkillBook } from "./SkillBook.interface";
import { SkillPage } from "./SkillPage";


export const SkillBook: FC<ISkillBook> = ({ onChooseSkill, onClose }) => {

    const getPages = useCallback((): JSX.Element[] => {
        const pages: ISkillItem[][] = []

        let temp: ISkillItem[] = [];

        SkillList.forEach((item, ind) => {
            if (ind % 4 === 0 && ind !== 0) {
                pages.push(temp)
                temp = []
            }
            temp.push(item)
        })
        pages.push(temp);
        console.log(pages);
        return pages.map((item, ind) => {
           return <SkillPage skills={item} onChooseSkill={onChooseSkill} key={ind} />
        })

    }, [])
    return (
        <Book pages={getPages()}>
            <Button onClick={onClose} title={'Close the book'}>
                <IoCloseCircle />
            </Button>
        </Book>
    )
}
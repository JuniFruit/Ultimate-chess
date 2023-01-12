import { mockups } from "../../../../assets/mockups/images";



export const tutorialPages: ITutorialItem[] = [
    {
        img: mockups.field_screenshot,
        title: 'Ultimate mode',
        body: 'Ultimate mode is an addition to a regular chess gameplay. This mode lets you experience Chess from a completely different angle. Some basic movements were altered and new features were added.'
    },
    {
        img: mockups.pawn_screenshot,
        title: 'Moves',
        body: 'Some basic moves were altered. Pawn now can take forward and move diagonally anytime. Rook can move only 4 squares vertically and horizontally and 1 square diagonally in any direction.'
    },
    {
        img: mockups.book_screenshot,
        title: 'Skills',
        body: 'Perhaps the most crucial addition. Now each player has the same set of skills that they can use to gain advatage in a game. Each skill has its own constraints. Skills cannot be used before the first move or when a King is under attack. Each skill costs a move and can be used only once in a match.'
    }
]


export interface ITutorialItem {
    img: string;
    title: string;
    body: string;
}
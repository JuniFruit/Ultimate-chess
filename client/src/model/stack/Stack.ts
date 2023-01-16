import { IFigure } from "../figures/figures.interface";
import { FigureNodeList, IFigureNode, IFigureNodeList } from "./LinkedList";

export interface IFigureStack {
    stack: IFigureNodeList;
    maxSize: number;
    size: number;
    push: (value: IFigure | null) => void;
    pop: () => IFigure | null;
}


export class FigureStack implements IFigureStack {
    stack: IFigureNodeList;
    maxSize: number;
    size: number;
    constructor(maxSize = Infinity) {
        this.stack = new FigureNodeList();
        this.maxSize = maxSize;
        this.size = 0
    }

    push(value: IFigure | null) {
        if (this.maxSize <= this.size) return 'Reached max size of the Stack';

        this.stack.addToHead(value);
        this.size++;
    }
    pop() {
        if (!this.size) return null;
        const popped = this.stack.removeHead();
        this.size--;
        if (popped) return popped.value;
        return null
    }
}
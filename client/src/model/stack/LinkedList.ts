import { IFigure } from "../figures/figures.interface";

export interface IFigureNode {
    value: IFigure | null;
    next: IFigureNode | null;

    setNextNode: (node: IFigureNode) => void;
}



export class FigureNode implements IFigureNode {
    value: IFigure | null;
    next: IFigureNode | null;

    constructor(value: IFigure | null, next: IFigureNode | null) {
        this.value = value;
        this.next = next;
    }

    setNextNode(node: IFigureNode) {

        this.next = node;
    }
}

export interface IFigureNodeList {
    head: IFigureNode | null;
    size: number;

    addToHead: (data: IFigure | null) => void;
    removeHead: () => IFigureNode | null;
}


export class FigureNodeList implements IFigureNodeList {
    head: IFigureNode | null;
    size: number;

    constructor() {
        this.head = null;
        this.size = 0;
    }

    addToHead(data: IFigure | null) {
        const currentHead = this.head;
        const newHead = new FigureNode(data, null);
        this.head = newHead;
        currentHead && this.head.setNextNode(currentHead);
        this.size++
    }

    removeHead() {
        const currentHead = this.head;
        if (!currentHead) return null;

        const newHead = currentHead.next;

        this.head = newHead;
        this.size--;
        return currentHead;

    }
}


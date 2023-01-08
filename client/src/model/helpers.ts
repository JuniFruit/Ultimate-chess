import { Colors } from "./colors.enum";
import { IFigure, IFigureInfo } from "./figures/figures.interface";

export const flipFEN = (FEN: string): string => {

  const positionRows = FEN.split(" ")[0].split("/").map((row) => {
    return row.split("").map(invertCase).join("");
  });
  const position = positionRows.reverse().join("/");

  let turn = FEN.split(" ")[1];
  turn = turn == "w" ? "b" : "w";

  let castle = FEN.split(" ")[2];
  if (castle != "-") {
    const castleArr = castle.split("").map(invertCase);
    castleArr.sort();
    castle = castleArr.join("");
  }

  let ep = FEN.split(" ")[3];
  if (ep != "-") {
    const epArr = ep.split("");
    epArr[1] = epArr[1] == "6" ? "3" : "6";
    ep = epArr.join("");
  }

  const rest = FEN.split(" ").slice(4);

  return [position, turn, castle, ep, ...rest].join(" ");
}

export const invertCase = (char: string): string => {
  if (char == char.toLowerCase())
    return char.toUpperCase();
  return char.toLowerCase();
}

export const returnColorCell = (row: number, col: number) => {
  return (row + col) % 2 !== 0 ? Colors.BLACK : Colors.WHITE
}

export const isInBounds = (x: number, y: number) => {
  if (x < 0 || x > 7 || y < 0 || y > 7) return false;
  return true;
}

export const convertToChar = (figure: IFigure) => {
  let char: string = figure.type;
  figure.color === Colors.BLACK ? char = char.toLowerCase() : char = char.toUpperCase();
  return char;
}

export const getFigureInfo = (figure: IFigure): IFigureInfo => {
  return {
    x: figure.x,
    y: figure.y,
    spriteSrc: figure.spriteSrc,
    pos: figure.pos,
    color: figure.color,
    type: figure.type,
    ultimateStates: figure.ultimateStates
  }
}

export const getFlippedPos = (posX: number, posY: number) => {
  const x = 7 - Math.floor(posX);
  const y = 7 - Math.floor(posY);
  return { x, y }
}



export const generateOffsets = (range: number, shape: 'square' | 'knight' | 'VnH',) => {
  const offsets: number[][] = [];
  let vals = [-range, 0, range];

  if (shape === 'knight') vals = [range, range + 1, -range, -range - 1]

  for (let i = 0; i < vals.length; i++) {
    for (let j = 0; j < vals.length; j++) {
      if (vals[i] === 0 && vals[j] === 0) continue;
      if ((shape === 'knight' || shape === 'VnH') && Math.abs(vals[i]) === Math.abs(vals[j])) continue;

      const offset = [];
      offset.push(vals[i]);
      offset.push(vals[j]);
      offsets.push(offset);
    }
  }
  return offsets
}

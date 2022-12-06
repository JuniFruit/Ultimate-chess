
export enum Direction {
    POS = 1,
    NEG = -1
}

export enum Results {
    CHECKMATE = 'checkmate',
    DRAW = 'draw'
}

export enum GameOver {
    WHITE = 'White wins',
    BLACK = 'Black wins',
    DRAW = 'Game tied'
}

export enum FENs {
    INIT = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w',
    KING_VS_ROOK_KNIGHT = '8/8/3k1r2/8/8/3Kn3/8/8 w',
}
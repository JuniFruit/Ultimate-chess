
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
    INIT = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq',
    KING_VS_ROOK_KNIGHT = '8/8/3k1r2/8/8/3Kn3/8/8 w',
    KING_KNIGHT_VS_KING_KNIGHT_PAWN = '8/3k2n1/8/3p4/3K1N2/8/8/8 w',
    KING_N_B_P_VS_K_B = '8/8/1b1k4/3P4/8/8/1N1K1B2/8 b',
    K_N_N_P_VS_K_B = '8/8/1b1k4/3P4/8/8/1N1K1N2/8 b',
    IS_STALEMATE = 'k7/2K5/3N4/8/1Q6/8/8/8 w'
}


export enum GameOverReasons {
    TIMEOUT = 'timeout',
    CHECKMATE = 'checkmate',
    RESIGN = 'resign'
}

export enum KillThreshold {
    SPREE = 3,
    DOMINATING = 6,
    UNSTOPPABLE = 9,
}
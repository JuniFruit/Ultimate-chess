

export const loginSpan = Date.now() + (1000 * 60 * 60 * 24 * 1) // 24 hours



export enum Errors {
    SAME_PLAYER = 'You can\'t play against yourself',
    INTERNAL = 'Something went wrong...',
    CONNECTION_LOST = 'Connection lost. Trying to reestablish connection',
    NO_CONNECTION = 'No connection to the server',
    INVALID_ROOM = 'Such room cannot be created',
    NO_PLAYERS = 'Room no longer exists due to player(s) having left.'

}

export enum MatchDuration {
    FIVE_MIN = 300,
    ONE_MIN = 60,
    THREE_MIN = 180,
    TEN_MIN = 600,
}

export enum Requests {
    DRAW = 'draw',
    REMATCH = 'rematch',
    RESIGN = 'resign'
}

export enum RequestMessages {
    REMATCH = 'Your opponent requests a rematch. Do you want to play again?',
    RESIGN = "Are you sure you want to resign?"
}


export enum ROLES {
    USER = 'Chess player',
    ADMIN = 'Administrator',
    CREATOR = 'Creator',
    SHOWCASE = 'Valuable visitor'
}
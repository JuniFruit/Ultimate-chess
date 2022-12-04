

export const loginSpan = Date.now() + (1000 * 60 * 60 * 24 * 1) // 24 hours



export enum Errors {
    SAME_PLAYER = 'You can\'t play against yourself',
    INTERNAL = 'Something went wrong...',
    CONNECTION_LOST = 'Connection lost. Trying to reestablish connection',
    NO_CONNECTION = 'No connection to the server',
}
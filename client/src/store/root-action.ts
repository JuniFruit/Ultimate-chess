import * as authActions from './auth/auth.actions';
import messageActions from './message/message.slice';

export const rootActions = {
    ...authActions,
    ...messageActions
}
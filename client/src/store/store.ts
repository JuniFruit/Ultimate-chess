import { configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE, persistStore } from "redux-persist";


import storage from "redux-persist/lib/storage";
import { api } from "./api/api";
import { rtkQueryErrorLogger } from "./middleware/errorHandler.middleware";
import { rootReducers } from "./root-reducers";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
}

const persistedReducer = persistReducer(persistConfig, rootReducers);


export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PURGE, REGISTER, PERSIST]
        }
    }).concat(rtkQueryErrorLogger).concat(api.middleware)
})


export const persistor = persistStore(store);


export type TypeRootState = ReturnType<typeof rootReducers> 
import { createStore, combineReducers } from 'redux';
import tokenReducer from "./auth/reducers";
import testReducer from "./test/reducers"
import { persistStore, persistReducer, persistCombineReducers, } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
}

const persistAuthConfig = {
    key: 'auth',
    storage,
}

const persistTestConfig = {
    key: 'test',
    storage,
}
const combinedReducers = combineReducers({token: persistReducer(persistAuthConfig, tokenReducer), test: persistReducer(persistTestConfig, testReducer)})
const persistedReducer = persistReducer(persistConfig, combinedReducers)

export const store = createStore(persistedReducer);

export const persistor = persistStore(store);
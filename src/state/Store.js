import { createStore } from 'redux';
import RootReducer from './RootReducer';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {key: 'root', storage: storage };
const persistedReducer = persistReducer(persistConfig, RootReducer);

const Store = createStore(persistedReducer);
const Persistor = persistStore(Store);

export { Store, Persistor };
import { combineReducers } from "redux";

import {userReducer} from './userReducer'
import {historyReducer} from './historyReducer'

const Reducers = combineReducers({
    user: userReducer,
    history: historyReducer
})

export default Reducers
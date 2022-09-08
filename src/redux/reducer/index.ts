import { combineReducers, createStore } from "redux";
import { DataReducer } from "./dataReducer";

const reducers = combineReducers({
    booking: DataReducer,
})

export default reducers;

export type State = ReturnType<typeof reducers>;
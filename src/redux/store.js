import { createStore, applyMiddleware } from "redux";
import rootReducers from "./reducers/index";
import thunk from 'redux-thunk';

const store = createStore(rootReducers, applyMiddleware(thunk));

export default store;
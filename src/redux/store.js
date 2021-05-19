import { createStore } from "redux";
import rootReducers from "./reducers/index";

const store = createStore(rootReducers);

export default store;
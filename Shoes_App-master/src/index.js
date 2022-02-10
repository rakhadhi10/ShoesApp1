import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";

import { createStore } from "redux";
import { Provider } from "react-redux";
import Reducers from "./reducer";

let globalState = createStore(Reducers);
globalState.subscribe(() =>
  console.log("Global State : ", globalState.getState())
);

ReactDOM.render(
  <Provider store={globalState}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
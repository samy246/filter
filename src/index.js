import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { StateProvider } from "./store/state";
import reducer, { initialState } from "./store/reducer";
import "./services/i18n";
import Spinner from "./components/Spinner";

ReactDOM.render(
  <React.StrictMode>
    <StateProvider initialState={initialState} reducer={reducer}>
      <React.Suspense fallback={<Spinner />}>
        <App />
      </React.Suspense>
    </StateProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();

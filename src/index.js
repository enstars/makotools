import React from "react";
import ReactDOM from "react-dom";
import "normalize.css/normalize.css";
import "./styles/index.scss";
// import reportWebVitals from './reportWebVitals';

import AuthProvider from "./services/auth";
import App from "./App";

ReactDOM.render(
    <AuthProvider>
        <App />
    </AuthProvider>,
    document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

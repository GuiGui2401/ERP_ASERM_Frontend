import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import { configureStore } from "@reduxjs/toolkit";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "react-redux";
import store from "./redux/reduxDistribution/root";

import axios from "axios";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));

//Setting AXIOS and token
// axios.defaults.baseURL = "https://oserpb.herokuapp.com/v1/";
axios.defaults.baseURL = process.env.REACT_APP_API; 

const accessToken = localStorage.getItem("access-token");

axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

// const rootStore = configureStore({
// 	reducer: {
// 	  store: store.reducer,
// 	  store1: store1.reducer,
// 	},
//   });

root.render(
	<Provider store={store}>
		<App />
	</Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
const configuration = {
	onUpdate: (registration) => {
		if (registration && registration.waiting) {
			if (
				window.confirm("Nouvelle version disponible!  Actualiser pour mettre à jour votre application?")
			) {
				registration.waiting.postMessage({ type: "SKIP_WAITING" });
				window.location.reload();
			}
		}
	},
};
serviceWorkerRegistration.register(configuration);
reportWebVitals(console.log());

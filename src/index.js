import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/root/App';
import firebase from 'firebase/compat/app';

import { configureStore } from "./redux/reducers/configureStore"
import { BrowserRouter } from "react-router-dom"
import { Provider } from 'react-redux';
const firebaseConfig = {
    apiKey: "AIzaSyD44u2KKiofMZpfS_QI37O7V-L49UMxhSU",
    authDomain: "solution-challenge-dc3b9.firebaseapp.com",
    projectId: "solution-challenge-dc3b9",
    storageBucket: "solution-challenge-dc3b9.appspot.com",
    messagingSenderId: "446618056956",
    appId: "1:446618056956:web:b8907677acf33546293f79",
    measurementId: "G-QRDEN6CLD3"
};
const store = configureStore()

firebase.initializeApp(firebaseConfig);
ReactDOM.render(<BrowserRouter>
    <Provider store={store}>
        <App />
    </Provider></BrowserRouter>, document.getElementById('root'));

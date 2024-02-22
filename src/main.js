import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import firebase from 'firebase/app'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA8lyXJvFXjprJL31yU29Jgr2704__tx68",
    authDomain: "alexprueba-c37af.firebaseapp.com",
    projectId: "alexprueba-c37af",
    storageBucket: "alexprueba-c37af.appspot.com",
    messagingSenderId: "756359901894",
    appId: "1:756359901894:web:335f84787773e54e9fddc7",
    measurementId: "G-V57RPKYNPE"
  };


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuario autenticado, monta la aplicación Vue con el enrutador
        createApp(App).mount('#app');
    } else {
        // Usuario no autenticado, redirige al inicio de sesión
        createApp(App).mount('#app');
    }
});
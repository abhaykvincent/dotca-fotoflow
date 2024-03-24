// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAnalytics,isSupported,logEvent } from "firebase/analytics";
import { getAuth, connectAuthEmulator, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

if(process.env.NODE_ENV === 'development'){
    // console.log('DEV MODE');
    // console.log(process.env.REACT_APP_API_KEY);
    
}
else{
    // console.log('PROD MODE');
    // console.log(process.env.REACT_APP_API_KEY);
}
const firebaseConfig = {
    apiKey: "AIzaSyCO4qL8Qrkyw0SbsAXD_h7YbJt-P8FS07o",
    authDomain: "dotca-media.firebaseapp.com",
    projectId: "dotca-media",
    storageBucket: "dotca-media.appspot.com",
    messagingSenderId: "1064470680992",
    appId: "1:1064470680992:web:b24a23b127997cb17580c5",
    measurementId: "G-LTHKZPEY27"
  };


const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
const db = getFirestore(app); 
const analytics = getAnalytics();
//setAnalyticsCollectionEnabled(true);



const auth = getAuth(app);

if (process.env.NODE_ENV === 'development') {
    const EMULATOR_HOST = process.env.REACT_APP_EMULATOR_HOST;
    const EMULATOR_PORT = process.env.REACT_APP_EMULATOR_PORT;
    const EMULATOR_FIRESTORE_PORT = process.env.REACT_APP_EMULATOR_FIRESTORE_PORT;
    const EMULATOR_AUTH_PORT = process.env.REACT_APP_EMULATOR_AUTH_PORT;


    connectStorageEmulator(storage, EMULATOR_HOST, EMULATOR_PORT);
    connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_FIRESTORE_PORT);
    connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${EMULATOR_AUTH_PORT}`);
}

const provider = new GoogleAuthProvider();

export { storage, db, analytics, auth, provider, signInWithPopup};
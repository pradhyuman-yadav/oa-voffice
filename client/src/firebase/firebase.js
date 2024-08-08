// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, push } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId,
    databaseURL: "https://oa-office-default-rtdb.firebaseio.com",
  };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseDatabase = getDatabase(firebaseApp);

const addClient = (clientId, data) => {
  set(ref(firebaseDatabase, `clients/${clientId}`), data);
};

const getClients = (callback) => {
  onValue(ref(firebaseDatabase, 'clients'), snapshot => {
      callback(snapshot.val());
  });
};

export { firebaseDatabase, ref, set, onValue, addClient, getClients };

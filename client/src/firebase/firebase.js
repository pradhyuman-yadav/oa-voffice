// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get, onValue } from "firebase/database";
import {update as updateAllCharactersData} from '../components/slices/allCharactersSlice'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD60huq4ObIvD35S7uyXYGsrofCy9Qsnvo",
  authDomain: "oa-office.firebaseapp.com",
  databaseURL: "https://oa-office-default-rtdb.firebaseio.com",
  projectId: "oa-office",
  storageBucket: "oa-office.appspot.com",
  messagingSenderId: "339387491948",
  appId: "1:339387491948:web:545241a37aa866f86dda49"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDatabase = getDatabase(firebaseApp);

// https://firebase.google.com/docs/database/web/read-and-write#basic_write
export const writeUserData = (data) => {
    console.debug('writeUserData, data:', data);
    set(ref(firebaseDatabase, `users/${data.id}`), data);
}

// TODO: Where to execute this function? When the user close the browser, remove the user's date automatically?
// https://firebase.google.com/docs/database/web/read-and-write#delete_data
export const deleteUserData = (data) => {
    console.debug('deleteUserData, data:', data);
    set(ref(firebaseDatabase, `users/${data.id}`), null);
}

// https://firebase.google.com/docs/database/web/read-and-write#web_value_events
// TODO: This function have to be put inside the useEffect(), cannot call a function here???
export const onUserDataChange = () => {
    const dbRef = ref(getDatabase(), 'users/');
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            console.log('onUserDataChange, data is empty');
            return;
        }
        console.debug('onUserDataChange, before, data:', data);
        updateAllCharactersData(data)
        console.debug('onUserDataChange, after');
    });
}

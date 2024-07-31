import React, { useEffect } from "react";
import { ref, set, onValue} from 'firebase/database';
import { connect } from "react-redux"; // Assuming you're using Redux
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import { firebaseDatabase as database } from '../firebase/firebase'; // Import Firebase Realtime Database
import {update as updateAllCharactersData} from './slices/allCharactersSlice'

const FirebaseConnection = ({updateAllCharactersData, allCharactersData }) => {
    useEffect(() => {
        // const users = {...allCharactersData};
        // const myId = MY_CHARACTER_INIT_CONFIG.id;
        const characterRef = ref(database, `users/`);
        const unsubscribe = onValue(characterRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // const updatedCharactersData = { ...allCharactersData, [myId]: data };
            updateAllCharactersData(data);
        }
        });
        return () => unsubscribe();
        }, [updateAllCharactersData, allCharactersData]);

        return null;
}

const mapStateToProps = (state) => {
    return { 
        allCharactersData: state.allCharactersData, // Ensure this prop is correctly mapped
        myCharactersData: state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id]
    };
};
  
const mapDispatchToProps = { updateAllCharactersData };

export default connect(mapStateToProps, mapDispatchToProps)(FirebaseConnection);
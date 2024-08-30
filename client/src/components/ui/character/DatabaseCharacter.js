import React from 'react';
import {connect} from 'react-redux';

import CharacterTemplate from "./CharacterTemplate";

function DatabaseCharacter({ myCharactersData }) {
    console.debug("DatabaseCharacter: myCharactersData: ", myCharactersData)
    return (
        <>
            {Object.keys(myCharactersData).map((key, index) => (
                <CharacterTemplate key={index} charactersData={myCharactersData[key]}/>
            ))}
        </>
    )
}

const mapStateToProps = (state) => {
    // TODO: Why infinite looping here?
    // console.debug("mapStateToProps: state.allCharacters.users: ", state.allCharacters.users);
    return {myCharactersData: state.allCharacters.users};
};

export default connect(mapStateToProps)(DatabaseCharacter);

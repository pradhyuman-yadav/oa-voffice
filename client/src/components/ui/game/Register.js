import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton, useDisclosure, Button, FormControl, FormLabel, Input, FormErrorMessage,
} from '@chakra-ui/react'
import React, {useEffect} from 'react'
import {MY_CHARACTER_INIT_CONFIG} from "../../../constances/characterConstants";
import {writeUserData} from "../../../firebase/firebase";
import {connect} from "react-redux";
import {update as updateAllCharactersData} from "../../slices/allCharactersSlice";
import {allowMove} from "../../slices/statusSlice";

const Register = ({allowMove, allCharactersData, updateAllCharactersData}) => {
    const mycharacterData = allCharactersData[MY_CHARACTER_INIT_CONFIG.id];

    const { isOpen, onOpen, onClose } = useDisclosure()

    const nameRef = React.useRef()

    const [inputName, setInputName] = React.useState('')

    useEffect(() => {
        onOpen()
        allowMove(false);
    }, []);

    function save() {
        if (!inputName) return;
        console.log(inputName)
        console.log(mycharacterData)

        const cloneMyCharacterData = { ...mycharacterData };
        cloneMyCharacterData.name = inputName;
        console.log('cloneMyCharacterData', cloneMyCharacterData);
        const cloneAllCharacterData = { ...allCharactersData };
        cloneAllCharacterData[cloneMyCharacterData.id] = cloneMyCharacterData;
        updateAllCharactersData(cloneAllCharacterData);
        writeUserData(cloneMyCharacterData);

        allowMove(true);
        onClose();
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                closeOnOverlayClick={false}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create your account</ModalHeader>
                    {/*<ModalCloseButton />*/}
                    <ModalBody pb={6}>
                        <FormControl isRequired isInvalid={!inputName}>
                            <FormLabel>Name</FormLabel>
                            <Input
                                value={inputName}
                                onChange={(e) => setInputName(e.target.value)}
                                placeholder='Your name'
                            />
                            <FormErrorMessage>Name is required.</FormErrorMessage>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={save}>
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

const mapStateToProps = (state) => {
    return {allCharactersData: state.allCharacters.users};
};

export default connect(mapStateToProps, {updateAllCharactersData, allowMove})(Register);

import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    FormLabel,
    Box,
    Textarea,
    Button,
    Input,
    Stack, useDisclosure, Radio, RadioGroup, Select,
} from '@chakra-ui/react'
import React, {useEffect, useState} from "react";
import {MY_CHARACTER_INIT_CONFIG} from "../../../constances/characterConstants";
import {connect} from "react-redux";
import {allowMove} from "../../slices/statusSlice";
import {CONSOLE_FORMAT_SERVER2CLIENT} from "../../../constances/webRTCKeyConstances";

const ChatRoom = ({allowMove, allCharactersData, webrtcSocket}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [placement, setPlacement] = React.useState('right')
    const nameField = React.useRef()
    const messageField = React.useRef()

    const [chatMsg, setChatMsg] = React.useState()
    const [selectedUsername, setSelectedUsername] = useState("");

    useEffect(() => {
        webrtcSocket.on('chat', ({msg, sender, receiver}) => {
            console.log(CONSOLE_FORMAT_SERVER2CLIENT, 'chat', {msg, sender, receiver})
            const mycharacterData = allCharactersData[MY_CHARACTER_INIT_CONFIG.id];
            console.log('allCharactersData', allCharactersData)
            console.log('MY_CHARACTER_INIT_CONFIG.id', MY_CHARACTER_INIT_CONFIG.id)
            console.log('mycharacterData', mycharacterData)
            console.log('mycharacterData.name', mycharacterData.name)
            if (!receiver || receiver === mycharacterData.name || receiver === 'all' || sender === mycharacterData.name) {
                // setChatMsg(<p>{data.msg}</p>)
                const msgDom = document.getElementById('messages');
                if (!msgDom) return;
                const item = document.createElement('li');
                item.textContent = msg;
                console.log(item)
                msgDom.appendChild(item);
                window.scrollTo(0, document.body.scrollHeight);
            }
        });

        return () => {
            webrtcSocket.off('chat')
        };
    }, [allCharactersData])

    function sendMsg() {
        console.log('click sendMsg');
        const mycharacterData = allCharactersData[MY_CHARACTER_INIT_CONFIG.id];
        // let receiver = nameField.current.value;
        let receiver = selectedUsername;
        console.log('receiver', receiver)
        let sender = mycharacterData.name;
        let sendMsg = messageField.current.value;
        let msg = `${sender}: ${sendMsg}`;
        console.log(msg);
        webrtcSocket.emit('chat', {msg, sender, receiver})
    }

    function open() {
        allowMove(false);
        onOpen();
    }

    function close() {
        allowMove(true);
        onClose();
    }

    return (
        <>
            <RadioGroup defaultValue={placement} onChange={setPlacement}>
                <Stack direction='row' mb='4'>
                    <Radio value='top'>Top</Radio>
                    <Radio value='right'>Right</Radio>
                    <Radio value='bottom'>Bottom</Radio>
                    <Radio value='left'>Left</Radio>
                </Stack>
            </RadioGroup>
            <Button colorScheme='blue' onClick={open}>
                Enter Chat Room
            </Button>
            <Drawer placement={placement} onClose={close} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>Chat Room</DrawerHeader>
                    <Box>
                        <FormLabel htmlFor='username'>Send Message To</FormLabel>
                        <Select id='username' placeholder='Select option'
                                onChange={event=> {setSelectedUsername(event.target.value)}}
                                value={selectedUsername}>
                            <option ref={nameField} value='all'>Send To Everyone</option>
                            {Object.keys(allCharactersData).filter(id => id !== MY_CHARACTER_INIT_CONFIG.id).map(id => {
                                return <option ref={nameField} key={id} value={allCharactersData[id].name}>{allCharactersData[id].name}</option>
                            })}
                        </Select>
                        {/*<Input*/}
                        {/*    ref={nameField}*/}
                        {/*    id='username'*/}
                        {/*    placeholder='leavel blank to send to all users'*/}
                        {/*/>*/}
                        <FormLabel htmlFor='message'>Message</FormLabel>
                        <Textarea
                            ref={messageField}
                            id='message'
                            placeholder='Please enter message'
                        />
                        <Button colorScheme='blue' onClick={sendMsg}>Send Message</Button>
                    </Box>
                    <DrawerBody>
                        <p id={'messages'}></p>
                        {/*<p>Some contents...</p>*/}
                        {/*<p>Some contents...</p>*/}
                        {/*<p>Some contents...</p>*/}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

const mapStateToProps = (state) => {
    return {allCharactersData: state.allCharacters.users};
};

export default connect(mapStateToProps, {allowMove})(ChatRoom);

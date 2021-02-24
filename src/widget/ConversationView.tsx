import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ConversationController } from "../controller/ConversationController";
import { ChatDispatcher } from "../dispatcher/ChatDispatcher";
import { FriendDispatcher } from "../dispatcher/FriendDispatcher";
import { User } from "../model/UserModel";
import { AppState } from "../state/AppState";
import { ChatState } from "../state/ChatState";
import { FriendState } from "../state/FriendState";
import './ConversationView.scss';

interface MapStateToProps {
    chatState: ChatState,
    thisUser: User,
    friendState: FriendState,
}

interface ConversationProps {
    selectedUser: User,
}

export const ConversationView = ({selectedUser}: ConversationProps) => {
    function MapStateToProps(state: AppState): MapStateToProps {
        return {
            chatState: state.chatState,
            thisUser: state.userState.user!,
            friendState: state.friendState,
        }
    };

    let {chatState, thisUser, friendState} = useSelector<AppState, MapStateToProps>(MapStateToProps);

    let dispatch = useDispatch();
    let inputTextRef = useRef<HTMLInputElement>(null);
    let chatDispatcher = useRef(new ChatDispatcher(dispatch)).current;
    let friendDispatcher = useRef(new FriendDispatcher(dispatch)).current;
    let controller = useRef(new ConversationController(chatDispatcher, friendDispatcher)).current;
    let previousUserInfoId = useRef<number | null>(null);

    function showMessages() {
        if (chatState.selectedChatId !== null) {
            let chat = chatState.findChatById(chatState.selectedChatId); //should always be able to find
            let ret = [];
            for (let i = 0; i < chat.messages.length ; i++) {
                let message = chat.messages[i];
                let messageClass: string;
                if (message.senderId === thisUser.infoId) {
                    messageClass = 'message-me';
                } else {
                    messageClass = 'message-them';
                }

                let firstMessageClass = '';
                if (i === chat.messages.length - 1 || chat.messages[i + 1].senderId !== message.senderId) {
                    firstMessageClass = 'first-message';
                }

                let timeString: string;
                let now = new Date();
                if (Math.abs(now.getTime() - message.sentTime.getTime()) < 24 * 3600 * 1000) {
                    timeString = '' + message.sentTime.getHours() + ':' + message.sentTime.getMinutes();
                } else {
                    timeString = '';
                }
                ret.push(
                    <div className={`${messageClass}-container`} key={message.id}>
                        <div className={messageClass + ' ' + firstMessageClass}>
                            <div className="message-content">
                                { message.message }
                            </div>
                            <div className="time">
                                { timeString }
                            </div>
                        </div>
                    </div>
                )
            }
            return ret;
        }
    }

    function onTextValueChanged(event: React.ChangeEvent<HTMLInputElement>) {
        controller.onTextValueChanged(selectedUser.infoId, event.target.value);
    }


    let textValue = chatState.writingMessagesToUser.get(selectedUser.infoId);
    if (textValue === undefined) {
        textValue = '';
    }
    
    useEffect(() => {
        let interval = setInterval(() => {
            controller.onPeriodicMessageFetch(thisUser, chatState, friendState);
        }, 1000);
        return () => clearInterval(interval);
    }, [controller, thisUser, chatState, friendState]);

    useEffect(() => {
        if (previousUserInfoId.current !== selectedUser.infoId) {
            controller.onSelectedUserChanged(thisUser.infoId, selectedUser.infoId, chatState);
        }
        previousUserInfoId.current = selectedUser.infoId;
    }, [controller, thisUser, selectedUser, chatState]);

    useEffect(() => {
        if (chatState.selectedChatId !== null) {
            let selectedChat = chatState.findChatById(chatState.selectedChatId);
            controller.onSelectedChatChanged(thisUser, selectedChat, friendState);
        }
    }, [chatState, controller, friendState, thisUser]);

    function onSendButtonClick() {
        controller.onSendText(chatState.selectedChatId, thisUser, selectedUser.infoId, textValue!);
    }

    useEffect(() => {
        let _inputTextRef = inputTextRef.current;
        function onEnterPressed(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                controller.onSendText(chatState.selectedChatId, thisUser, selectedUser.infoId, textValue!);
            }
        }

        if (_inputTextRef !== null) {
            _inputTextRef!.addEventListener("keypress", onEnterPressed, false);
        }
        return () => _inputTextRef?.removeEventListener("keypress", onEnterPressed, false);
    }, [textValue, chatState, thisUser, selectedUser.infoId, controller]);

    return (
        <div className="conversation-view">
            <div className="header-bar">
                <div className="profile-letter">
                    { selectedUser.name[0].toUpperCase() }
                </div>
                <div className="name">
                    { selectedUser.name }
                </div>
            </div>
            <div className="messages-container">
                { showMessages() }
            </div>
            <div className="conversation-view-input-container">
                <input value={textValue} onChange={onTextValueChanged} type="text" ref={inputTextRef}></input>
                <button className="send-button" onClick={onSendButtonClick}>
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    )
}
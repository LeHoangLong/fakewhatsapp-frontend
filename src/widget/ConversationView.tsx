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
    let {chatState, thisUser, friendState} = useSelector<AppState, MapStateToProps>((state: AppState): MapStateToProps => ({
        chatState: state.chatState,
        thisUser: state.userState.user!,
        friendState: state.friendState,
    }));

    let dispatch = useDispatch();
    let chatDispatcher = useRef(new ChatDispatcher(dispatch)).current;
    let friendDispatcher = useRef(new FriendDispatcher(dispatch)).current;
    let controller  = useRef(new ConversationController(chatDispatcher, friendDispatcher)).current;

    function showMessages() {
        if (chatState.selectedChat !== null) {
            return (
                <div>Hello</div>
            )
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
        controller.onSelectedUserChanged(thisUser.infoId, selectedUser.infoId, chatState);
    }, [controller, thisUser, selectedUser, chatState]);

    useEffect(() => {
        if (chatState.selectedChat) {
            controller.onSelectedChatChanged(chatState.selectedChat, friendState);
        }
    }, [chatState.selectedChat, controller, friendState]);

    function onSendButtonClick() {
        controller.onSendText(chatState.selectedChat, thisUser, selectedUser.infoId, textValue!);
    }

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
            <div className="message-container">
                { showMessages() }
            </div>
            <div className="conversation-view-input-container">
                <input value={textValue} onChange={onTextValueChanged} type="text"></input>
                <button className="send-button" onClick={onSendButtonClick}>
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    )
}
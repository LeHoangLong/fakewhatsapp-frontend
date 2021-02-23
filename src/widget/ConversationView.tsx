import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ConversationController } from "../controller/ConversationController";
import { ChatDispatcher } from "../dispatcher/ChatDispatcher";
import { User } from "../model/UserModel";
import { AppState } from "../state/AppState";
import { ChatState } from "../state/ChatState";
import './ConversationView.scss';

interface MapStateToProps {
    chatState: ChatState,
}

interface ConversationProps {
    selectedUser: User,
}

export const ConversationView = ({selectedUser}: ConversationProps) => {
    let {chatState} = useSelector<AppState, MapStateToProps>((state: AppState): MapStateToProps => ({
        chatState: state.chatState,
    }));

    let dispatch = useDispatch();
    let chatDispatcher = useRef(new ChatDispatcher(dispatch)).current;
    let controller  = useRef(new ConversationController(chatDispatcher)).current;

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
                <i className="fas fa-paper-plane"></i>
            </div>
        </div>
    )
}
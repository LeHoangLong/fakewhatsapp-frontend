import { BaseAction } from "../actions/BaseActions";
import { ChatActionAddChat, ChatActionAddMessage, ChatActionUpdateMessage, ChatActionInsertChat, ChatActionSetSelectedChat, ChatActionSetSelectedPendingMessage, EChatActionTypes } from "../actions/ChatActions";
import { ChatState } from "../state/ChatState";

export const initialChatState: ChatState = new ChatState([], true, null, new Map());

export const chatReducer = (state: ChatState = initialChatState, action: BaseAction) => {
    switch (action.type) {
        case EChatActionTypes.ADD_CHAT:
            let addChatAction = action as ChatActionAddChat;
            return new ChatState(
                state.concat(addChatAction.chats),
                addChatAction.isEndReached,
                state.selectedChat,
                state.writingMessagesToUser,
            )
        case EChatActionTypes.INSERT_CHAT:
            let insertChatAction = action as ChatActionInsertChat;
            return new ChatState(
                state.insertChat(insertChatAction.chat),
                state.isEndReached,
                state.selectedChat,
                state.writingMessagesToUser,
            );
        case EChatActionTypes.SET_SELECTED_CHAT:
            let setSelectedChat = action as ChatActionSetSelectedChat;
            return new ChatState(
                state.chats,
                state.isEndReached,
                setSelectedChat.chat,
                state.writingMessagesToUser,
            );
        case EChatActionTypes.SET_PENDING_MESSAGE:
            let setPendingMessageAction = action as ChatActionSetSelectedPendingMessage;
            return new ChatState(
                state.chats,
                state.isEndReached,
                state.selectedChat,
                state.setWritingMessageToUser(setPendingMessageAction.recipientInfoId, setPendingMessageAction.content),
            )
        case EChatActionTypes.ADD_MESSAGE:
            let addMessageAction = action as ChatActionAddMessage;
            return new ChatState(
                state.insertMessage(addMessageAction.chatId, addMessageAction.message),
                state.isEndReached,
                state.selectedChat,
                state.writingMessagesToUser,
            )
        case EChatActionTypes.UPDATE_MESSAGE:
            let changeMessageStatusAction = action as ChatActionUpdateMessage;
            return new ChatState(
                state.updateMessageState(changeMessageStatusAction.chatId, changeMessageStatusAction.messageId, changeMessageStatusAction.token, changeMessageStatusAction.sentTime, changeMessageStatusAction.status),
                state.isEndReached,
                state.selectedChat,
                state.writingMessagesToUser,
            );
        default:
            return state;
    }
}
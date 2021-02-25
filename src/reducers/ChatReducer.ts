import { BaseAction } from "../actions/BaseActions";
import { ChatActionSetSelectedUser, ChatActionAddChat, ChatActionAddMessage, ChatActionUpdateMessage, ChatActionInsertChat, ChatActionSetSelectedChatId , ChatActionSetSelectedPendingMessageToUser, ChatActionSetSelectedPendingMessageToChat, EChatActionTypes, ChatActionUpdateChatMessageStatus } from "../actions/ChatActions";
import { ChatState } from "../state/ChatState";

export const initialChatState: ChatState = new ChatState([], true, null, null, new Map(), new Map());

export const chatReducer = (state: ChatState = initialChatState, action: BaseAction) => {
    switch (action.type) {
        case EChatActionTypes.ADD_CHAT:
            let addChatAction = action as ChatActionAddChat;
            return new ChatState(
                state.concat(addChatAction.chats),
                addChatAction.isEndReached,
                state.selectedChatId,
                state.selectedUser,
                state.writingMessagesToUser,
                state.writingMessagesToChat,
            )
        case EChatActionTypes.INSERT_CHAT:
            let insertChatAction = action as ChatActionInsertChat;
            return new ChatState(
                state.insertChat(insertChatAction.chat),
                state.isEndReached,
                state.selectedChatId,
                state.selectedUser,
                state.writingMessagesToUser,
                state.writingMessagesToChat,
            );
        case EChatActionTypes.SET_SELECTED_CHAT_ID:
            let setSelectedChat = action as ChatActionSetSelectedChatId;
            return new ChatState(
                state.chats,
                state.isEndReached,
                setSelectedChat.chatId,
                setSelectedChat.chatId === null? state.selectedUser: null,
                state.writingMessagesToUser,
                state.writingMessagesToChat,
            );
        case EChatActionTypes.SET_SELECTED_USER:
            let setSelectedUserAction = action as ChatActionSetSelectedUser;
            return new ChatState(
                state.chats,
                state.isEndReached,
                null,
                setSelectedUserAction.user,
                state.writingMessagesToUser,
                state.writingMessagesToChat,
            );

        case EChatActionTypes.SET_PENDING_MESSAGE_TO_USER:
            let setPendingMessageToUserAction = action as ChatActionSetSelectedPendingMessageToUser;
            return new ChatState(
                state.chats,
                state.isEndReached,
                state.selectedChatId,
                state.selectedUser,
                state.setWritingMessageToUser(setPendingMessageToUserAction.recipientInfoId, setPendingMessageToUserAction.content),
                state.writingMessagesToChat,
            )
            case EChatActionTypes.SET_PENDING_MESSAGE_TO_CHAT:
                let setPendingMessageToChatAction = action as ChatActionSetSelectedPendingMessageToChat;
                return new ChatState(
                    state.chats,
                    state.isEndReached,
                    state.selectedChatId,
                    state.selectedUser,
                    state.writingMessagesToUser,
                    state.setWritingMessageToUser(setPendingMessageToChatAction.chatId, setPendingMessageToChatAction.content),
                )
        case EChatActionTypes.ADD_MESSAGE:
            let addMessageAction = action as ChatActionAddMessage;
            return new ChatState(
                state.insertMessage(addMessageAction.chatId, addMessageAction.message),
                state.isEndReached,
                state.selectedChatId,
                state.selectedUser,
                state.writingMessagesToUser,
                state.writingMessagesToChat,
            )
        case EChatActionTypes.UPDATE_MESSAGE:
            let changeMessageStatusAction = action as ChatActionUpdateMessage;
            return new ChatState(
                state.updateMessageState(changeMessageStatusAction.chatId, changeMessageStatusAction.messageId, changeMessageStatusAction.token, changeMessageStatusAction.sentTime, changeMessageStatusAction.status),
                state.isEndReached,
                state.selectedChatId,
                state.selectedUser,
                state.writingMessagesToUser,
                state.writingMessagesToChat,
            );
        case EChatActionTypes.UPDATE_CHAT_MESSAGE_STATUS:
            let updateChatMessageStatusAction = action as ChatActionUpdateChatMessageStatus;
            return new ChatState(
                state.updateChatMessageStatus(updateChatMessageStatusAction.chatId, updateChatMessageStatusAction.status),
                state.isEndReached,
                state.selectedChatId,
                state.selectedUser,
                state.writingMessagesToUser,
                state.writingMessagesToChat,
            )
        default:
            return state;
    }
}
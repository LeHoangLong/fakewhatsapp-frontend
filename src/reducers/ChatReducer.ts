import { BaseAction } from "../actions/BaseActions";
import { ChatActionAddChat, ChatActionSetSelectedPendingMessage, EChatActionTypes } from "../actions/ChatActions";
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
        case EChatActionTypes.SET_PENDING_MESSAGE:
            let setPendingMessageAction = action as ChatActionSetSelectedPendingMessage;
            return new ChatState(
                state.chats,
                state.isEndReached,
                state.selectedChat,
                state.setWritingMessageToUser(setPendingMessageAction.recipientInfoId, setPendingMessageAction.content),
            )
        default:
            return state;
    }
}
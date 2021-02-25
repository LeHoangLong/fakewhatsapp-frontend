import { Chat, EChatMessageStatus } from "../model/ChatModel";
import { EMessageStatus, Message } from "../model/MessageModel";
import { User } from "../model/UserModel";
import { BaseAction } from "./BaseActions";

export const EChatActionTypes = {
    ADD_CHAT: Symbol('ADD_CHAT'),
    INSERT_CHAT: Symbol('INSERT_CHAT'), //insert chat will replace if there is existing chat with the same id
    SET_SELECTED_CHAT_ID: Symbol('SET_SELECTED_CHAT_ID'),
    SET_SELECTED_USER: Symbol('SET_SELECTED_USER'),
    SET_PENDING_MESSAGE_TO_USER: Symbol('SET_PENDING_MESSAGE_TO_USER'),
    SET_PENDING_MESSAGE_TO_CHAT: Symbol('SET_PENDING_MESSAGE_TO_CHAT'),
    ADD_MESSAGE: Symbol('ADD_MESSAGE'),
    UPDATE_MESSAGE: Symbol('UPDATE_MESSAGE'), // If both token and message id are present, message id will also be updated using token
    UPDATE_CHAT_MESSAGE_STATUS: Symbol('UPDATE_CHAT_MESSAGE_STATUS'), // chat message status is whether message for chat is being fetched or not
}

export class ChatActionAddChat extends BaseAction {
    constructor(
        public chats: Chat[],
        public isEndReached: boolean,
    ) {
        super(EChatActionTypes.ADD_CHAT);
    }
}

export class ChatActionInsertChat extends BaseAction {
    constructor(
        public chat: Chat,
    ) {
        super(EChatActionTypes.INSERT_CHAT);
    }
}

export class ChatActionSetSelectedChatId extends BaseAction {
    constructor(
        public chatId: number | null,
    ) {
        super(EChatActionTypes.SET_SELECTED_CHAT_ID);
    }
}

export class ChatActionSetSelectedUser extends BaseAction {
    constructor(
        public user: User | null,
    ) {
        super(EChatActionTypes.SET_SELECTED_USER);
    }
}

export class ChatActionSetSelectedPendingMessageToUser extends BaseAction {
    constructor(
        public recipientInfoId: number,
        public content: string,
    ) {
        super(EChatActionTypes.SET_PENDING_MESSAGE_TO_USER);
    }
}

export class ChatActionSetSelectedPendingMessageToChat extends BaseAction {
    constructor(
        public chatId: number,
        public content: string,
    ) {
        super(EChatActionTypes.SET_PENDING_MESSAGE_TO_CHAT);
    }
}

export class ChatActionAddMessage extends BaseAction {
    constructor (
        public chatId: number,
        public message: Message,
    ) {
        super(EChatActionTypes.ADD_MESSAGE)
    }
}

export class ChatActionUpdateMessage extends BaseAction {
    constructor (
        public chatId: number,
        public messageId: number | null,
        public token: string | null,
        public sentTime: Date,
        public status: EMessageStatus,
    ) {
        super(EChatActionTypes.UPDATE_MESSAGE)
    }
}

export class ChatActionUpdateChatMessageStatus extends BaseAction {
    constructor(
        public chatId: number,
        public status: EChatMessageStatus,
    ) {
        super(EChatActionTypes.UPDATE_CHAT_MESSAGE_STATUS);
    }
}

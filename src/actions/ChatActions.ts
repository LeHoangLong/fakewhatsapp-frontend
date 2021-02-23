import { Chat } from "../model/ChatModel";
import { BaseAction } from "./BaseActions";

export const EChatActionTypes = {
    ADD_CHAT: Symbol('ADD_CHAT'),
    INSERT_CHAT: Symbol('INSERT_CHAT'),
    SET_SELECTED_CHAT: Symbol('SET_SELECTED_CHAT'),
    SET_PENDING_MESSAGE: Symbol('SET_PENDING_MESSAGE'),
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

export class ChatActionSetSelectedChat extends BaseAction {
    constructor(
        public chat: Chat | null,
    ) {
        super(EChatActionTypes.SET_SELECTED_CHAT);
    }
}

export class ChatActionSetSelectedPendingMessage extends BaseAction {
    constructor(
        public recipientInfoId: number,
        public content: string,
    ) {
        super(EChatActionTypes.SET_PENDING_MESSAGE);
    }
}

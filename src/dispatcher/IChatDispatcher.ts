import { Chat } from "../model/ChatModel";

export class IChatDispatcherChatToUserIdDoesNotExists {
    constructor(
        public participantId: number
    ) {

    }
}

export interface IChatDispatcher {
    fetchRecentChats(offset: number, limit: number): Promise<void>;
    fetchChatToUser(thisUserInfoId: number, userInfoId: number): Promise<Chat>;
    setSelectedChat(chat: Chat | null): void;
    setWritingMessageToUser(recipientInfoId: number, content: string): void;
}
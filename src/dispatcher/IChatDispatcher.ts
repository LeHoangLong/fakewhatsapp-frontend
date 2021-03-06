import { Chat, EChatMessageStatus } from "../model/ChatModel";
import { Message } from "../model/MessageModel";
import { User } from "../model/UserModel";

export class IChatDispatcherChatToUserIdDoesNotExists {
    constructor(
        public participantId: number
    ) {

    }
}

export interface FindUserDelegate {
    (userInfoId: number): Promise<User>;
}

export interface AddUserDelegate {
    (user: User, isFriend: boolean): void;
}

export interface IChatDispatcher {
    fetchRecentChats(offset: number, limit: number, addUserDelegate: AddUserDelegate): Promise<void>;
    fetchChatToUser(thisUserInfoId: number, userInfoId: number): Promise<Chat>;
    setSelectedChatId(chat: number | null): void;
    setSelectedUser(user: User): void;
    setWritingMessageToUser(recipientInfoId: number, content: string): void;
    setWritingMessageToChat(chatId: number, content: string): void;
    sendMessageToChat(sender: User, chatId: number, content: string): Promise<Message>;
    createChat(thisUserInfoId: number, otherUserInfoId: number): Promise<Chat>;
    fetchMessagesFromChat(chatId: number, limit: number, offset: number, findUserDelegate: FindUserDelegate): Promise<Message[]>;
    updateChatMessageStatus(chatId: number, chatMessageStatus: EChatMessageStatus): Promise<void>;
}
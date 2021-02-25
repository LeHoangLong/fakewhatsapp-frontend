import { Chat, EChatMessageStatus } from '../model/ChatModel';
import { EMessageStatus, Message } from '../model/MessageModel';
import { User } from '../model/UserModel';

export class IChatStateErrorChatIdNotFound {
    constructor(
        public chatId: number,
    ){

    }

    toString(): string {
        return `Chat with id ${this.chatId} not found`
    }
}

export class ChatStateErrorChatToUserNotFound {

}

export class ChatState {
    constructor(
        public chats: Chat[],
        public isEndReached: boolean,
        public selectedChatId: number | null,
        public selectedUser: User | null,
        public writingMessagesToUser: Map<number, string>,
        public writingMessagesToChat: Map<number, string>,
    ){

    }

    concat(chat: Chat[]): Chat[] {
        let newChats = this.chats.concat(chat);
        return newChats.sort((a, b) => -(a.latestMessageSentTime.getTime() - b.latestMessageSentTime.getTime()));
    }

    insertChat(chat: Chat): Chat[] {
        let newChats = this.chats.slice();
        let index = this.chats.findIndex((element) => element.id === chat.id);
        if (index === -1) {
            newChats.push(chat);
        } else {
            newChats[index] = chat;
        }
        return newChats.sort((a, b) => -(a.latestMessageSentTime.getTime() - b.latestMessageSentTime.getTime()));
    }

    private sortMessages(messages: Message[]): void {
        messages.sort((a, b) => {
            if (a.sentTime !== null && b.sentTime !== null) {
                return -(a.sentTime.getTime() - b.sentTime.getTime());
            } else if (a.sentTime !== null) {
                // if a.sent time is not null, we push it to the higher index
                return 1;
            } else if (b.sentTime !== null) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    insertMessage(chatId: number, message: Message): Chat[] {
        let newChats = this.chats.slice();
        let index = this.chats.findIndex((element) => element.id === chatId);
        if (index !== -1) {
            let prevChat = newChats[index];
            let latestMessageSentTime: Date;
            let latestMessageContent: string;
            if (message.sentTime > prevChat.latestMessageSentTime) {
                latestMessageSentTime = message.sentTime;
                latestMessageContent = message.message;
            } else {
                latestMessageSentTime = prevChat.latestMessageSentTime;
                latestMessageContent = prevChat.latestMessageContent;
            }
            let messageIndex = prevChat.messages.findIndex((element) => element.id === message.id);
            let newMessages: Message[];
            if (messageIndex === -1) {
                newMessages = prevChat.messages.concat([message]);
            } else {
                newMessages = prevChat.messages.slice();
                newMessages[messageIndex] = message;
            }
            
            this.sortMessages(newMessages);
            newChats[index] = new Chat(
                prevChat.id,
                prevChat.name,
                latestMessageContent,
                latestMessageSentTime,
                prevChat.participantsId,
                newMessages,
                prevChat.chatMessageStatus,
                prevChat.isGroupChat,
            )
        }
        return newChats;
    }

    updateMessageState(chatId: number, messageId: number | null, token: string | null, messageSentTime: Date, status: EMessageStatus): Chat[] {
        let newChats = this.chats.slice();
        let index = this.chats.findIndex((element) => element.id === chatId);
        if (index !== -1) {
            let prevChat = newChats[index];
            let newMessages: Message[] = prevChat.messages.slice();
            let messageIndex: number = -1;
            if (token !== null) {
                messageIndex = prevChat.messages.findIndex((element) => element.token === token);
            } else if (messageId !== null){
                messageIndex = prevChat.messages.findIndex((element) => element.id === messageId);
            }
            
            if (messageIndex !== -1) {
                let prevMessage = prevChat.messages[messageIndex];
                newMessages[messageIndex] = new Message(
                    messageId,
                    prevMessage.senderId,
                    prevMessage.senderName,
                    prevMessage.message,
                    messageSentTime,
                    status,
                    prevMessage.token,
                )
            }
            
            let latestMessageSentTime: Date;
            let latestMessageContent: string;
            if (messageSentTime > prevChat.latestMessageSentTime) {
                latestMessageSentTime = newMessages[messageIndex].sentTime;
                latestMessageContent = newMessages[messageIndex].message;
            } else {
                latestMessageSentTime = prevChat.latestMessageSentTime;
                latestMessageContent = prevChat.latestMessageContent;
            }
            this.sortMessages(newMessages);
            newChats[index] = new Chat(
                prevChat.id,
                prevChat.name,
                latestMessageContent,
                latestMessageSentTime,
                prevChat.participantsId,
                newMessages,
                prevChat.chatMessageStatus,
                prevChat.isGroupChat,
            )
        }
        return newChats;
    }

    findChatToUser(thisUserInfoId: number, userInfoId: number): Chat | null {
        for (let i = 0;i < this.chats.length; i++) {
            if (this.chats[i].participantsId.includes(thisUserInfoId) && this.chats[i].participantsId.includes(userInfoId) && this.chats[i].participantsId.length === 2) {
                return this.chats[i];
            }
        }
        return null;
    }

    setWritingMessageToUser(userInfoId: number, content: string): Map<number, string> {
        let newMap = new Map<number, string>(this.writingMessagesToUser);
        newMap.set(userInfoId, content);
        return newMap;
    }

    setWritingMessageToChat(userInfoId: number, content: string): Map<number, string> {
        let newMap = new Map<number, string>(this.writingMessagesToChat);
        newMap.set(userInfoId, content);
        return newMap;
    }

    updateChatMessageStatus(chatId: number, chatMessageStatus: EChatMessageStatus): Chat[] {
        let newChats = this.chats.slice();
        let index = this.chats.findIndex((element) => element.id === chatId);
        if (index !== -1) {
            let prevChat = newChats[index];
            newChats[index] = new Chat(
                prevChat.id,
                prevChat.name,
                prevChat.latestMessageContent,
                prevChat.latestMessageSentTime,
                prevChat.participantsId,
                prevChat.messages,
                chatMessageStatus,
                prevChat.isGroupChat,
            );
        }
        return newChats;   
    }

    findChatById(chatId: number): Chat {
        let index = this.chats.findIndex((element) => element.id === chatId);
        if (index !== -1) {
            return this.chats[index];
        } else {
            throw new IChatStateErrorChatIdNotFound(chatId);
        }
    }
}
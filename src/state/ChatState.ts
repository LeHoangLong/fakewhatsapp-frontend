import { Chat, EChatMessageStatus } from '../model/ChatModel';
import { EMessageStatus, Message } from '../model/MessageModel';
export class ChatState {
    constructor(
        public chats: Chat[],
        public isEndReached: boolean,
        public selectedChat: Chat | null,
        public writingMessagesToUser: Map<number, string>
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
            newChats[index] = new Chat(
                prevChat.id,
                latestMessageContent,
                latestMessageSentTime,
                prevChat.participantsId,
                prevChat.messages.concat([message]),
                prevChat.chatMessageStatus,
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
            newChats[index] = new Chat(
                prevChat.id,
                latestMessageContent,
                latestMessageSentTime,
                prevChat.participantsId,
                newMessages,
                prevChat.chatMessageStatus,
            )
        }
        return newChats;
    }

    doesChatToUserExists(thisUserInfoId: number, userInfoId: number): boolean {
        for (let i = 0;i < this.chats.length; i++) {
            if (this.chats[i].participantsId.includes(thisUserInfoId) && this.chats[i].participantsId.includes(userInfoId) && this.chats[i].participantsId.length === 2) {
                return true;
            }
        }
        return false;
    }

    setWritingMessageToUser(userInfoId: number, content: string): Map<number, string> {
        let newMap = new Map<number, string>(this.writingMessagesToUser);
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
                prevChat.latestMessageContent,
                prevChat.latestMessageSentTime,
                prevChat.participantsId,
                prevChat.messages,
                chatMessageStatus,
            );
        }
        return newChats;   
    }
}
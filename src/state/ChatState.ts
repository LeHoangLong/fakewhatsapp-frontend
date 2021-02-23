import { Chat } from '../model/ChatModel';
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
}
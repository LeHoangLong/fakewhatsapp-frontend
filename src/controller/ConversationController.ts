import { IChatDispatcher, IChatDispatcherChatToUserIdDoesNotExists } from "../dispatcher/IChatDispatcher";
import { Chat } from "../model/ChatModel";
import { User } from "../model/UserModel";
import { ChatState } from "../state/ChatState";

export class ConversationController {
    constructor(
        public chatDispatcher: IChatDispatcher
    ) {

    }

    async onSelectedUserChanged(thisUserInfoId: number, selectUserInfoId: number, chatState: ChatState) {
        if (!chatState.doesChatToUserExists(thisUserInfoId, selectUserInfoId)){
            try {
                let chat = await this.chatDispatcher.fetchChatToUser(thisUserInfoId, selectUserInfoId);
                await this.chatDispatcher.setSelectedChat(chat);
            } catch (error) {
                if (error instanceof IChatDispatcherChatToUserIdDoesNotExists) {
                    await this.chatDispatcher.setSelectedChat(null);
                } else {
                    throw error;
                }
            }
        }
    }

    onChatStateChanged(chatState: ChatState) {

    }

    onTextValueChanged(selectedUserInfoId: number, content: string) {
        this.chatDispatcher.setWritingMessageToUser(selectedUserInfoId, content);
    }

    async onSendText(chat: Chat | null, thisUser: User, otherUserInfoId: number, content: string) {
        if (chat === null) {
            chat = await this.chatDispatcher.createChat(thisUser.infoId, otherUserInfoId);
        }
        await this.chatDispatcher.sendMessageToChat(thisUser, chat.id, content);
    }
}
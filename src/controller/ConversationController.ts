import { IChatDispatcher, IChatDispatcherChatToUserIdDoesNotExists } from "../dispatcher/IChatDispatcher";
import { IFriendDispatcher } from "../dispatcher/IFriendDispatcher";
import { Chat, EChatMessageStatus } from "../model/ChatModel";
import { User } from "../model/UserModel";
import { ChatState } from "../state/ChatState";
import { FriendState } from "../state/FriendState";

export class ConversationController {
    constructor(
        public chatDispatcher: IChatDispatcher,
        public friendDispatcher: IFriendDispatcher,
    ) {

    }

    async onSelectedUserChanged(thisUserInfoId: number, selectUserInfoId: number, chatState: ChatState) {
        if (!chatState.doesChatToUserExists(thisUserInfoId, selectUserInfoId)){
            try {
                let chat = await this.chatDispatcher.fetchChatToUser(thisUserInfoId, selectUserInfoId);
                await this.chatDispatcher.setSelectedChatId(chat.id);
            } catch (error) {
                if (error instanceof IChatDispatcherChatToUserIdDoesNotExists) {
                    await this.chatDispatcher.setSelectedChatId(null);
                } else {
                    throw error;
                }
            }
        }
    }

    onChatStateChanged(chatState: ChatState) {

    }

    async onSelectedChatChanged(chat: Chat, friendState: FriendState) {
        if (chat.chatMessageStatus === EChatMessageStatus.NOT_FETCHED) {
            this.chatDispatcher.updateChatMessageStatus(chat.id, EChatMessageStatus.FETCHING);
            await this.chatDispatcher.fetchMessagesFromChat(chat.id, async (userInfoId: number): Promise<User> => {
                if (friendState.doesFriendWithInfoIdExists(chat.id)) {
                    return friendState.findFriendByInfoId(chat.id);
                } else {
                    return this.friendDispatcher.findFriendByUserId(userInfoId);
                }
            });
            this.chatDispatcher.updateChatMessageStatus(chat.id, EChatMessageStatus.FETCHED);
        }
    }

    onTextValueChanged(selectedUserInfoId: number, content: string) {
        this.chatDispatcher.setWritingMessageToUser(selectedUserInfoId, content);
    }

    async onSendText(chatId: number | null, thisUser: User, otherUserInfoId: number, content: string) {
        if (chatId === null) {
            let chat = await this.chatDispatcher.createChat(thisUser.infoId, otherUserInfoId);
            chatId = chat.id;
        }
        await this.chatDispatcher.sendMessageToChat(thisUser, chatId, content);
        await this.chatDispatcher.setWritingMessageToUser(otherUserInfoId, '');
    }
}
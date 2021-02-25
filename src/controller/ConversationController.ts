import { config } from "../config";
import { IChatDispatcher, IChatDispatcherChatToUserIdDoesNotExists } from "../dispatcher/IChatDispatcher";
import { IFriendDispatcher } from "../dispatcher/IFriendDispatcher";
import { Chat, EChatMessageStatus } from "../model/ChatModel";
import { User } from "../model/UserModel";
import { ChatState } from "../state/ChatState";
import { FriendState } from "../state/FriendState";

export class ConversationControllerErrorEitherSelectedChatOrUserMustBeValid {

}

export class ConversationController {
    constructor(
        public chatDispatcher: IChatDispatcher,
        public friendDispatcher: IFriendDispatcher,
    ) {
    }

    async onSelectedUserChanged(thisUserInfoId: number, selectUserInfoId: number, chatState: ChatState) {
        // search in the state if we already have chat to this user
        let foundChat = chatState.findChatToUser(thisUserInfoId, selectUserInfoId);
        if (foundChat !== null) {
            if (foundChat.id !== chatState.selectedChatId) {
                this.chatDispatcher.setSelectedChatId(foundChat.id);
            }
        } else {
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

    async onSelectedChatChanged(thisUser: User, chat: Chat, friendState: FriendState) {
        if (chat.chatMessageStatus === EChatMessageStatus.NOT_FETCHED) {
            this.chatDispatcher.updateChatMessageStatus(chat.id, EChatMessageStatus.FETCHING);
            await this.chatDispatcher.fetchMessagesFromChat(chat.id, config.DEFAULT_PAGE_SIZE, 0, async (userInfoId: number): Promise<User> => {
                if (thisUser.infoId === userInfoId) {
                    return thisUser;
                } else if (friendState.doesFriendWithInfoIdExists(userInfoId)) {
                    return friendState.findFriendByInfoId(userInfoId);
                } else {
                    return this.friendDispatcher.findFriendByUserId(userInfoId);
                }
            });
            this.chatDispatcher.updateChatMessageStatus(chat.id, EChatMessageStatus.FETCHED);
        }
    }

    onTextValueChanged(selectedUser: User | null, selectedChat: Chat | null, content: string) {
        if (selectedUser !== null) {
            this.chatDispatcher.setWritingMessageToUser(selectedUser.infoId, content);
        }
        if (selectedChat !== null) {
            this.chatDispatcher.setWritingMessageToChat(selectedChat.id, content);
        }
        if ( selectedChat === null && selectedUser === null) {
            throw new ConversationControllerErrorEitherSelectedChatOrUserMustBeValid();
        }
    }

    async onSendText(selectedChat: Chat | null, thisUser: User, otherUser: User | null, content: string) {
        // either selected chat or otheruser must be valid
        if (selectedChat === null && otherUser !== null) {
            let chat = await this.chatDispatcher.createChat(thisUser.infoId, otherUser.infoId);
            await this.chatDispatcher.sendMessageToChat(thisUser, chat.id, content);
            await this.chatDispatcher.setWritingMessageToUser(otherUser.infoId, '');
        } else if (selectedChat !== null && otherUser === null) {
            await this.chatDispatcher.sendMessageToChat(thisUser, selectedChat.id, content);
            await this.chatDispatcher.setWritingMessageToChat(selectedChat.id, '');
        } else {
            throw new ConversationControllerErrorEitherSelectedChatOrUserMustBeValid();
        }
    }

    async onPeriodicMessageFetch(thisUser: User, chatState: ChatState, friendState: FriendState) {
        if (chatState.selectedChatId !== null) {
            let selectedChat = chatState.findChatById(chatState.selectedChatId);
            if (selectedChat.chatMessageStatus === EChatMessageStatus.FETCHED) {
                this.chatDispatcher.updateChatMessageStatus(selectedChat.id, EChatMessageStatus.FETCHING);
                await this.chatDispatcher.fetchMessagesFromChat(selectedChat.id, config.DEFAULT_PAGE_SIZE, 0, async (userInfoId: number): Promise<User> => {
                    if (thisUser.infoId === userInfoId) {
                        return thisUser;
                    } else if (friendState.doesFriendWithInfoIdExists(userInfoId)) {
                        return friendState.findFriendByInfoId(userInfoId);
                    } else {
                        return this.friendDispatcher.findFriendByUserId(userInfoId);
                    }
                });
                this.chatDispatcher.updateChatMessageStatus(selectedChat.id, EChatMessageStatus.FETCHED);
            }
        }
    }

}
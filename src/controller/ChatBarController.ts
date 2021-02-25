import { config } from "../config";
import { IChatDispatcher } from "../dispatcher/IChatDispatcher";
import { IFriendDispatcher } from "../dispatcher/IFriendDispatcher";
import { Chat } from "../model/ChatModel";
import { User } from "../model/UserModel";
import { ChatState } from "../state/ChatState";
import { FriendState } from "../state/FriendState";
import { EOperationStatus, OperationStatus } from "../state/OperationStatusState";

export class ChatBarController {
    constructor(
        private dispatcher: IChatDispatcher,
        private friendDispatcher: IFriendDispatcher,
    ) {

    }

    onFetchChatOperationStatusChanged(fetchChatOperationStatus: OperationStatus) {
        if (fetchChatOperationStatus.status === EOperationStatus.INIT) {
            this.dispatcher.fetchRecentChats(0, config.DEFAULT_PAGE_SIZE);
        }
    }

    async onChatStateChanges(thisUser: User, chatState: ChatState, friendState: FriendState) {
        // fetch all friend info in each chat
        // since chat state is always changing, we need some way to only fetch user for each chat once
        // for now, checking if friend state includes friend info id is sufficient, since all direct chat to user
        // must be friend. But for group chat, we will need to add a flag (maybe a user info fetch time) since we may not
        // know all the participants in the chat. Or maybe we simply show anonymous avatar if user is not friend
        for (let i = 0; i < chatState.chats.length; i++) {
            let chat: Chat = chatState.chats[i];
            for (let j = 0; j < chat.participantsId.length; j++) {
                let participantId = chat.participantsId[j];
                if (!friendState.doesFriendWithInfoIdExists(participantId) && thisUser.infoId !== participantId) {
                    await this.friendDispatcher.findFriendByUserId(participantId);
                }
            }
        }
    }
}
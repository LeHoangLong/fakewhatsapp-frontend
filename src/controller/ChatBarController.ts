import { config } from "../config";
import { IChatDispatcher } from "../dispatcher/IChatDispatcher";
import { EOperationStatus, OperationStatus } from "../state/OperationStatusState";

export class ChatBarController {
    constructor(
        private dispatcher: IChatDispatcher,
    ) {

    }

    onFetchChatOperationStatusChanged(fetchChatOperationStatus: OperationStatus) {
        if (fetchChatOperationStatus.status === EOperationStatus.INIT) {
            this.dispatcher.fetchRecentChats(0, config.DEFAULT_PAGE_SIZE);
        }
    }
}
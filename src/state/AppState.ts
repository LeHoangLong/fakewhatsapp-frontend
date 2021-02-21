import { FoundUserState } from "./FoundUserState";
import { FriendState } from "./FriendState";
import { OperationStatusState } from "./OperationStatusState";
import { UserState } from "./UserState";

export class AppState {
    constructor(
        public userState: UserState, 
        public operationStatusState: OperationStatusState, 
        public friendState: FriendState,
        public foundUserState: FoundUserState,
    ) {
    }
}
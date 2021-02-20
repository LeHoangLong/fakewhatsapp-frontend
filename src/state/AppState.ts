import { FriendState } from "./FriendState";
import { OperationStatusState } from "./OperationStatusState";
import { UserState } from "./UserState";

export class AppState {
    userState: UserState;
    operationStatusState: OperationStatusState;
    friendState: FriendState;
    constructor(userState: UserState, operationStatusState: OperationStatusState, friendState: FriendState) {
        this.userState = userState;
        this.operationStatusState = operationStatusState;
        this.friendState = friendState;
    }
}
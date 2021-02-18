import { OperationStatusState } from "./OperationStatusState";
import { UserState } from "./UserState";

export class AppState {
    userState: UserState;
    operationStatusState: OperationStatusState;
    constructor(userState: UserState, operationStatusState: OperationStatusState) {
        this.userState = userState;
        this.operationStatusState = operationStatusState;
    }
}